package com.jsp.ebanking.service;

import com.jsp.ebanking.dto.TransferDto;
import com.jsp.ebanking.entity.BankTransactions;
import com.jsp.ebanking.entity.SavingBankAccount;
import com.jsp.ebanking.entity.User;
import com.jsp.ebanking.exception.DataNotFoundException;
import com.jsp.ebanking.exception.MissMatchException;
import com.jsp.ebanking.exception.PaymentFailedException;
import com.jsp.ebanking.repository.SavingAccountRepository;
import com.jsp.ebanking.repository.UserRepository;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

@Service
public class AiToolCallService {

    private final UserRepository userRepository;
    private final SavingAccountRepository savingAccountRepository;

    public AiToolCallService(UserRepository userRepository, SavingAccountRepository savingAccountRepository) {
        this.userRepository = userRepository;
        this.savingAccountRepository = savingAccountRepository;
    }

    @Tool(description = "Transfer money from the logged-in user's savings account to a recipient using mobile number or account number.")
    @Transactional
    public String transferMoney(
            @ToolParam(description = "Recipient mobile number or account number") String toMobileOrAccount,
            @ToolParam(description = "Amount in rupees") double amountInRupees) {
        User user = getCurrentUser();
        SavingBankAccount fromAccount = user.getBankAccount();
        if (fromAccount == null) {
            return "ERROR: You do not have a savings account. Create one first.";
        }
        if (!fromAccount.isActive() || fromAccount.isBlocked()) {
            return "ERROR: Your account is not active or blocked. Contact admin.";
        }

        BigDecimal amount = BigDecimal.valueOf(amountInRupees).setScale(2, RoundingMode.HALF_UP);
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            return "ERROR: Transfer amount must be greater than zero.";
        }
        if (amount.compareTo(new BigDecimal("100000")) > 0) {
            return "ERROR: Per transaction limit is ₹1,00,000.";
        }
        if (fromAccount.getBalance().compareTo(amount) < 0) {
            return "ERROR: Insufficient balance. Your balance is ₹" + fromAccount.getBalance();
        }

        SavingBankAccount toAccount = resolveRecipient(toMobileOrAccount);
        if (toAccount == null) {
            return "ERROR: Recipient not found. Please check the mobile number or account number.";
        }
        if (fromAccount.getAccountNumber().equals(toAccount.getAccountNumber())) {
            return "ERROR: You cannot transfer to your own account.";
        }
        if (!toAccount.isActive() || toAccount.isBlocked()) {
            return "ERROR: Recipient account is not active or blocked.";
        }

        String txnId = UUID.randomUUID().toString();
        List<BankTransactions> fromTxns = fromAccount.getBankTransactions();
        if (fromTxns == null) fromTxns = new LinkedList<>();
        BankTransactions debit = new BankTransactions(null, txnId, amount, "DEBIT", null,
                fromAccount.getBalance(), fromAccount.getBalance().subtract(amount));
        fromTxns.add(debit);
        fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
        fromAccount.setBankTransactions(fromTxns);

        List<BankTransactions> toTxns = toAccount.getBankTransactions();
        if (toTxns == null) toTxns = new LinkedList<>();
        BankTransactions credit = new BankTransactions(null, txnId, amount, "CREDIT", null,
                toAccount.getBalance(), toAccount.getBalance().add(amount));
        toTxns.add(credit);
        toAccount.setBalance(toAccount.getBalance().add(amount));
        toAccount.setBankTransactions(toTxns);

        savingAccountRepository.save(fromAccount);
        savingAccountRepository.save(toAccount);

        return "SUCCESS: ₹" + amount + " transferred from your account ****" +
                String.valueOf(fromAccount.getAccountNumber()).substring(6) +
                " to account ****" + String.valueOf(toAccount.getAccountNumber()).substring(6) +
                ". New balance: ₹" + fromAccount.getBalance();
    }

    @Tool(description = "Check the logged-in user's savings account balance and status.")
    public String checkBalance() {
        User user = getCurrentUser();
        SavingBankAccount account = user.getBankAccount();
        if (account == null) {
            return "You do not have a savings account yet.";
        }
        if (!account.isActive()) {
            return "Your account is pending admin approval.";
        }
        return "Your account ****" + String.valueOf(account.getAccountNumber()).substring(6) +
                " has a balance of ₹" + account.getBalance() +
                " (Status: " + (account.isBlocked() ? "Blocked" : "Active") + ").";
    }

    private SavingBankAccount resolveRecipient(String input) {
        if (input == null || input.isBlank()) return null;
        String trimmed = input.trim();
        try {
            Long accNum = Long.valueOf(trimmed);
            return savingAccountRepository.findByAccountNumber(accNum).orElse(null);
        } catch (NumberFormatException e) {
            // try mobile lookup
        }
        String digitsOnly = trimmed.replaceAll("[^0-9]", "");
        String last10 = digitsOnly.length() >= 10 ? digitsOnly.substring(digitsOnly.length() - 10) : digitsOnly;
        String[] candidates = { trimmed, digitsOnly, last10, "+91" + last10, "+91 " + last10 };
        for (String candidate : candidates) {
            if (candidate == null || candidate.isBlank()) continue;
            User u = userRepository.findByMobile(candidate);
            if (u != null && u.getBankAccount() != null) {
                return u.getBankAccount();
            }
        }
        return null;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String email = auth.getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new DataNotFoundException("User not found: " + email);
        }
        return user;
    }
}

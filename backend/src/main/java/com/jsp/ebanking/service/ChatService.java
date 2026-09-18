package com.jsp.ebanking.service;

import com.jsp.ebanking.dto.*;
import com.jsp.ebanking.entity.*;
import com.jsp.ebanking.repository.*;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Objects;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatClient.Builder chatClientBuilder;
    private final UserRepository userRepository;
    private final SavingAccountRepository savingAccountRepository;
    private final AiToolCallService aiToolCallService;
    private final UserConsentRepository consentRepository;

    private String maskAccount(Long accNum) {
        String s = String.valueOf(accNum);
        return "****" + s.substring(Math.max(0, s.length() - 4));
    }

    public ChatResponse chat(ChatRequest request) {
        User currentUser = getCurrentUser();
        
        UserConsent consent = consentRepository.findByUserEmail(currentUser.getEmail());
        if (consent == null) {
            consent = new UserConsent();
            consent.setUserEmail(currentUser.getEmail());
            consent.setDataSharingConsent(true);
            consentRepository.save(consent);
        } else if (!consent.isDataSharingConsent()) {
            return new ChatResponse("To use the AI assistant, please enable 'Data Sharing with Third Parties' in your Profile privacy settings. No data has been sent.");
        }

        String bankingContext = buildBankingContext(currentUser);

        String systemPrompt = "You are an AI banking assistant for eBanking. " +
                "You help users with their banking queries. " +
                "Use the banking data below for accurate, personalized answers.\n\n" +
                "IMPORTANT RULES:\n" +
                "- Only use the data provided. Do not make up information.\n" +
                "- Be concise and helpful.\n" +
                "- Never share sensitive data like passwords or full account numbers.\n" +
                "- You can perform actions using available tools when the user asks for transfers or balance checks.\n\n" +
                bankingContext;

        String answer = null;
        for (int attempt = 1; attempt <= 3; attempt++) {
            try {
                answer = chatClientBuilder.build().prompt()
                        .system(systemPrompt)
                        .user(request.message())
                        .tools(aiToolCallService)
                        .call()
                        .content();
                if (answer != null) {
                    break;
                }
            } catch (Exception e) {
                if (attempt == 3) {
                    return new ChatResponse("The AI service is currently busy handling high traffic. Please try again in a few seconds.");
                }
                try {
                    Thread.sleep(1200 * attempt);
                } catch (InterruptedException ignored) {}
            }
        }

        return new ChatResponse(answer != null ? answer : "I was unable to process your request at this time.");
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        return userRepository.findByEmail(auth.getName());
    }

    private String buildBankingContext(User user) {
        StringBuilder sb = new StringBuilder();

        sb.append("=== YOUR PROFILE ===\n");
        sb.append("Name: ").append(user.getName()).append("\n");
        sb.append("Email: ").append(user.getEmail()).append("\n");
        sb.append("Mobile: ").append(user.getMobile()).append("\n");
        sb.append("Role: ").append(user.getRole()).append("\n");

        // If ADMIN, inject ALL system data
        if (user.getRole() == BankingRole.ADMIN) {
            sb.append("\n=== ADMIN ACCESS: FULL SYSTEM DATA ===\n");
            buildAdminContext(sb);
            return sb.toString();
        }

        // Regular user - only their own data
        SavingBankAccount account = user.getBankAccount();
        if (account == null) {
            sb.append("\n=== BANK ACCOUNT STATUS ===\n");
            sb.append("You do NOT have a savings account yet. ");
            sb.append("Create one to check balance, make transfers, or view transactions.\n");
            return sb.toString();
        }

        buildUserAccountContext(sb, account);
        return sb.toString();
    }

    private void buildAdminContext(StringBuilder sb) {
        // All users
        List<User> allUsers = userRepository.findAll();
        sb.append("\n=== ALL USERS (").append(allUsers.size()).append(" total) ===\n");
        for (User u : allUsers) {
            sb.append("- ").append(u.getName())
              .append(" | Role: ").append(u.getRole());
            if (u.getBankAccount() != null) {
                sb.append(" | Account: ").append(maskAccount(u.getBankAccount().getAccountNumber()))
                  .append(" | Balance: $").append(u.getBankAccount().getBalance())
                  .append(" | Active: ").append(u.getBankAccount().isActive());
            } else {
                sb.append(" | No bank account");
            }
            sb.append("\n");
        }

        // All accounts
        List<SavingBankAccount> allAccounts = savingAccountRepository.findAll();
        sb.append("\n=== ALL ACCOUNTS (").append(allAccounts.size()).append(" total) ===\n");
        for (SavingBankAccount acc : allAccounts) {
            sb.append("- Account: ").append(maskAccount(acc.getAccountNumber()))
              .append(" | Holder: ").append(acc.getFullName())
              .append(" | Balance: $").append(acc.getBalance())
              .append(" | Active: ").append(acc.isActive())
              .append(" | Blocked: ").append(acc.isBlocked())
              .append("\n");
        }

        // Stats
        long activeAccounts = allAccounts.stream().filter(SavingBankAccount::isActive).count();
        long blockedAccounts = allAccounts.stream().filter(SavingBankAccount::isBlocked).count();
        sb.append("\n=== SYSTEM STATS ===\n");
        sb.append("Total Users: ").append(allUsers.size()).append("\n");
        sb.append("Total Accounts: ").append(allAccounts.size()).append("\n");
        sb.append("Active Accounts: ").append(activeAccounts).append("\n");
        sb.append("Blocked Accounts: ").append(blockedAccounts).append("\n");
    }

    private void buildUserAccountContext(StringBuilder sb, SavingBankAccount account) {
        sb.append("\n=== YOUR SAVINGS ACCOUNT ===\n");
        sb.append("Account Number: ").append(maskAccount(account.getAccountNumber())).append("\n");
        sb.append("Account Holder: ").append(account.getFullName()).append("\n");
        sb.append("Balance: $").append(account.getBalance()).append("\n");
        sb.append("IFSC Code: ").append(account.getIfscCode()).append("\n");
        sb.append("Branch: ").append(account.getBranch()).append("\n");
        sb.append("Status: ").append(account.isActive() ? "Active" : "Pending Approval").append("\n");
        sb.append("Blocked: ").append(account.isBlocked() ? "Yes" : "No").append("\n");

        List<BankTransactions> transactions = account.getBankTransactions();
        if (transactions != null && !transactions.isEmpty()) {
            sb.append("\n=== RECENT TRANSACTIONS (last 10) ===\n");
            int count = 0;
            for (int i = transactions.size() - 1; i >= 0 && count < 10; i--) {
                BankTransactions t = transactions.get(i);
                sb.append("- ").append(t.getType())
                  .append(": $").append(t.getAmount())
                  .append(" | Balance After: $").append(t.getBalanceAfterTransaction())
                  .append(" | Date: ").append(t.getCreatedTime())
                  .append("\n");
                count++;
            }

            BigDecimal totalCredit = transactions.stream()
                    .filter(t -> "CREDIT".equals(t.getType()) || "DEPOSIT".equals(t.getType()))
                    .map(BankTransactions::getAmount)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal totalDebit = transactions.stream()
                    .filter(t -> "DEBIT".equals(t.getType()))
                    .map(BankTransactions::getAmount)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            sb.append("\n=== SUMMARY ===\n");
            sb.append("Total Transactions: ").append(transactions.size()).append("\n");
            sb.append("Total Money In (Credit/Deposit): ₹").append(totalCredit.setScale(2, RoundingMode.HALF_UP)).append("\n");
            sb.append("Total Money Out (Debit): ₹").append(totalDebit.setScale(2, RoundingMode.HALF_UP)).append("\n");
        } else {
            sb.append("\n=== TRANSACTIONS ===\n");
            sb.append("No transactions yet.\n");
        }
    }
}

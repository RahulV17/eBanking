package com.jsp.ebanking.service;

import java.util.*;
import java.util.stream.Collectors;

import com.jsp.ebanking.dto.*;
import com.jsp.ebanking.entity.*;
import com.jsp.ebanking.exception.DataNotFoundException;
import com.jsp.ebanking.mapper.UserMapper;
import com.jsp.ebanking.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

	private final SavingAccountRepository savingAccountRepository;
	private final UserRepository userRepository;
	private final UserMapper userMapper;
	private final UserConsentRepository consentRepository;

	// ==================== DASHBOARD STATS ====================

	@Override
	public ResponseEntity<ResponseDto> getDashboardStats() {
		long totalUsers = userRepository.count();
		long activeUsers = userRepository.countByBankAccount_Active(true);
		long blockedAccounts = savingAccountRepository.countByBlocked(true);
		long pendingAccounts = savingAccountRepository.countByActive(false);

		Map<String, Object> stats = new LinkedHashMap<>();
		stats.put("totalUsers", totalUsers);
		stats.put("activeUsers", activeUsers);
		stats.put("blockedAccounts", blockedAccounts);
		stats.put("pendingAccounts", pendingAccounts);
		stats.put("totalAccounts", savingAccountRepository.count());

		return ResponseEntity.ok(new ResponseDto("Dashboard Stats", stats));
	}

	// ==================== USER MANAGEMENT ====================

	@Override
	public ResponseEntity<ResponseDto> getAllUsers() {
		List<User> users = userRepository.findAll();
		List<AdminUserDto> result = users.stream().map(user -> {
			AdminUserDto dto = new AdminUserDto();
			dto.setId(user.getId());
			dto.setName(user.getName());
			dto.setEmail(user.getEmail());
			dto.setMobile(user.getMobile());
			dto.setRole(user.getRole().name());
			
			SavingBankAccount account = user.getBankAccount();
			dto.setHasBankAccount(account != null);
			dto.setAccountActive(account != null && account.isActive());
			dto.setAccountBlocked(account != null && account.isBlocked());
			
			// Check consent
			UserConsent consent = consentRepository.findByUserEmail(user.getEmail());
			dto.setConsentToViewTransactions(consent != null && consent.isAdminViewTransactions());
			
			return dto;
		}).collect(Collectors.toList());
		return ResponseEntity.ok(new ResponseDto("Users Found", result));
	}

	@Override
	public ResponseEntity<ResponseDto> searchUsers(String query) {
		List<User> users = userRepository.findAll().stream()
				.filter(u -> u.getName().toLowerCase().contains(query.toLowerCase()) ||
						u.getEmail().toLowerCase().contains(query.toLowerCase()) ||
						u.getMobile().contains(query))
				.collect(Collectors.toList());
		
		List<AdminUserDto> result = users.stream().map(user -> {
			AdminUserDto dto = new AdminUserDto();
			dto.setId(user.getId());
			dto.setName(user.getName());
			dto.setEmail(user.getEmail());
			dto.setMobile(user.getMobile());
			dto.setRole(user.getRole().name());
			
			SavingBankAccount account = user.getBankAccount();
			dto.setHasBankAccount(account != null);
			dto.setAccountActive(account != null && account.isActive());
			dto.setAccountBlocked(account != null && account.isBlocked());
			
			UserConsent consent = consentRepository.findByUserEmail(user.getEmail());
			dto.setConsentToViewTransactions(consent != null && consent.isAdminViewTransactions());
			
			return dto;
		}).collect(Collectors.toList());
		return ResponseEntity.ok(new ResponseDto("Search Results", result));
	}

	// ==================== ACCOUNT MANAGEMENT ====================

	@Override
	public ResponseEntity<ResponseDto> getPendingAccounts() {
		List<SavingBankAccount> list = savingAccountRepository.findByActiveFalse();
		return ResponseEntity.ok(new ResponseDto("Pending Accounts", list));
	}

	@Override
	public ResponseEntity<ResponseDto> approveBankAccount(Long accountNumber) {
		SavingBankAccount account = savingAccountRepository.findById(accountNumber)
				.orElseThrow(() -> new DataNotFoundException("No Account Details Found"));
		account.setActive(true);
		savingAccountRepository.save(account);
		return ResponseEntity.ok(new ResponseDto("Account Approved Success", account));
	}

	@Override
	public ResponseEntity<ResponseDto> blockAccount(Long accountNumber) {
		SavingBankAccount account = savingAccountRepository.findById(accountNumber)
				.orElseThrow(() -> new DataNotFoundException("Invalid Account Number"));
		account.setBlocked(true);
		savingAccountRepository.save(account);
		return ResponseEntity.ok(new ResponseDto("Account Blocked Success", account));
	}

	@Override
	public ResponseEntity<ResponseDto> unblockAccount(Long accountNumber) {
		SavingBankAccount account = savingAccountRepository.findById(accountNumber)
				.orElseThrow(() -> new DataNotFoundException("Invalid Account Number"));
		account.setBlocked(false);
		savingAccountRepository.save(account);
		return ResponseEntity.ok(new ResponseDto("Account Unblocked Success", account));
	}

	// ==================== CONSENT-CHECKED TRANSACTION VIEWING ====================

	@Override
	public ResponseEntity<ResponseDto> getUserByAccountNumber(Long accountNumber) {
		User user = userRepository.findByBankAccount_accountNumber(accountNumber)
				.orElseThrow(() -> new DataNotFoundException("No User Details Found"));
		return ResponseEntity.ok(new ResponseDto("User Details Found", userMapper.toDto(user)));
	}

	@Override
	public ResponseEntity<ResponseDto> getBankAccount(String email) {
		User user = userRepository.findByEmail(email);
		if (user == null)
			throw new DataNotFoundException("Invalid Email");
		SavingBankAccount account = user.getBankAccount();
		if (account != null && account.isActive())
			return ResponseEntity.ok(new ResponseDto("Account Found", account));
		else
			throw new DataNotFoundException("No Account for the User");
	}

	@Override
	public ResponseEntity<ResponseDto> getBankTransactions(Long accountNumber) {
		SavingBankAccount account = savingAccountRepository.findById(accountNumber)
				.orElseThrow(() -> new DataNotFoundException("Invalid Account Number"));
		
		// Find user by account number
		User user = userRepository.findByBankAccount_accountNumber(accountNumber)
				.orElseThrow(() -> new DataNotFoundException("User not found"));
		
		// Check consent
		UserConsent consent = consentRepository.findByUserEmail(user.getEmail());
		if (consent == null || !consent.isAdminViewTransactions()) {
			return ResponseEntity.status(403).body(new ResponseDto(
				"ACCESS DENIED: User has not granted permission to view their transactions. " +
				"Ask the user to enable 'Admin View Transactions' in their privacy settings.", null));
		}
		
		List<BankTransactions> transactions = account.getBankTransactions();
		if (transactions.isEmpty())
			throw new DataNotFoundException("No Transactions Found");
		return ResponseEntity.ok(new ResponseDto("Transactions Found", transactions));
	}
}

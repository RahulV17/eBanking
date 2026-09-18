package com.jsp.ebanking.service;

import com.jsp.ebanking.dto.ResponseDto;
import org.springframework.http.ResponseEntity;

public interface AdminService {

	ResponseEntity<ResponseDto> getDashboardStats();

	ResponseEntity<ResponseDto> getAllUsers();

	ResponseEntity<ResponseDto> searchUsers(String query);

	ResponseEntity<ResponseDto> getPendingAccounts();

	ResponseEntity<ResponseDto> getUserByAccountNumber(Long accountNumber);

	ResponseEntity<ResponseDto> approveBankAccount(Long accountNumber);

	ResponseEntity<ResponseDto> getBankAccount(String email);

	ResponseEntity<ResponseDto> getBankTransactions(Long accountNumber);

	ResponseEntity<ResponseDto> blockAccount(Long accountNumber);

	ResponseEntity<ResponseDto> unblockAccount(Long accountNumber);
}

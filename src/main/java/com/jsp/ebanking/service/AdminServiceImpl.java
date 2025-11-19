package com.jsp.ebanking.service;

import java.util.List;

import com.jsp.ebanking.dto.ResponseDto;
import com.jsp.ebanking.entity.SavingBankAccount;
import com.jsp.ebanking.entity.User;
import com.jsp.ebanking.exception.DataNotFoundException;
import com.jsp.ebanking.mapper.UserMapper;
import com.jsp.ebanking.repository.SavingAccountRepository;
import com.jsp.ebanking.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

	private final SavingAccountRepository savingAccountRepository;
	private final UserRepository userRepository;
	private final UserMapper userMapper;

	@Override
	public ResponseEntity<ResponseDto> getPendingAccounts() {
		List<SavingBankAccount> list = savingAccountRepository.findByActiveFalse();
		if (list.isEmpty())
			throw new DataNotFoundException("No Accounts Pending for Verfication");
		else {
			return ResponseEntity.ok(new ResponseDto("Accounts Found", list));
		}
	}

	@Override
	public ResponseEntity<ResponseDto> getUser(Long accountNumber) {
		User user = userRepository.findByBankAccount_accountNumber(accountNumber)
				.orElseThrow(() -> new DataNotFoundException("No User Details Found"));
		return ResponseEntity.ok(new ResponseDto("User Details Found", userMapper.toDto(user)));
	}

	@Override
	public ResponseEntity<ResponseDto> approveBankAccount(Long accountNumber) {
		SavingBankAccount account = savingAccountRepository.findById(accountNumber)
				.orElseThrow(() -> new DataNotFoundException("No Account Details Found"));
		account.setActive(true);
		savingAccountRepository.save(account);
		return ResponseEntity.ok(new ResponseDto("Account Approved Success", account));
	}

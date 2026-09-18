package com.jsp.ebanking.controller;



import java.security.Principal;
import java.util.Map;

import com.jsp.ebanking.dto.DepositDto;
import com.jsp.ebanking.dto.ResponseDto;
import com.jsp.ebanking.dto.SavingAccountDto;
import com.jsp.ebanking.dto.TransferDto;
import com.jsp.ebanking.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class UserController {

	private final UserService userService;

	@GetMapping("/account/bank")
	public ResponseEntity<ResponseDto> viewSavingsAccount(Principal principal) {
		return userService.viewSavingsAccount(principal);
	}

	@PostMapping("/account/bank")
	public ResponseEntity<ResponseDto> createSavingsAccount(Principal principal,
			@RequestBody @Valid SavingAccountDto accountDto) {
		return userService.createSavingsAccount(principal, accountDto);
	}

	@GetMapping("/bank-balance")
	public ResponseEntity<ResponseDto> checkBalance(Principal principal) {
		return userService.checkBalance(principal);
	}

	@PostMapping("/deposit")
	public ResponseEntity<ResponseDto> intializeDeposit(@RequestBody @Valid DepositDto dto, Principal principal) {
		return userService.deposit(principal, dto);
	}

	@PostMapping("/confirm-deposit")
	public ResponseEntity<ResponseDto> confirmDeposit(@RequestParam String razorpay_order_id,
			@RequestParam String razorpay_payment_id, @RequestParam String razorpay_signature,
			Principal principal) {
		return userService.confirmPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature, principal);
	}
	
	@PostMapping("/transfer")
	public ResponseEntity<ResponseDto> transferAmount(Principal principal,@RequestBody @Valid TransferDto dto) {
		return userService.transfer(principal,dto);
	}

	@PostMapping("/transfer/order")
	public ResponseEntity<ResponseDto> createTransferOrder(Principal principal,@RequestBody @Valid TransferDto dto) {
		return userService.createTransferOrder(principal,dto);
	}

	@PostMapping("/transfer/confirm")
	public ResponseEntity<ResponseDto> confirmTransfer(@RequestParam String razorpay_order_id,
			@RequestParam String razorpay_payment_id, @RequestParam String razorpay_signature,
			@RequestBody TransferDto dto, Principal principal) {
		return userService.confirmTransfer(principal, dto, razorpay_order_id, razorpay_payment_id, razorpay_signature);
	}
}

package com.jsp.ebanking.service;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.ResponseEntity;

import com.jsp.ebanking.dto.LoginDto;
import com.jsp.ebanking.dto.OtpDto;
import com.jsp.ebanking.dto.ResetPasswordDto;
import com.jsp.ebanking.dto.ResponseDto;
import com.jsp.ebanking.dto.SavingAccountDto;
import com.jsp.ebanking.dto.TransferDto;
import com.jsp.ebanking.dto.UserDto;

public interface UserService {

	ResponseEntity<ResponseDto> register(UserDto dto);

	ResponseEntity<ResponseDto> verifyOtp(OtpDto dto);

	ResponseEntity<ResponseDto> resendOtp(String email);

	ResponseEntity<ResponseDto> forgotPassword(String email);

	ResponseEntity<ResponseDto> resetPassword(ResetPasswordDto dto);

	ResponseEntity<ResponseDto> login(LoginDto dto);

	ResponseEntity<ResponseDto> logout(String authHeader);

	ResponseEntity<ResponseDto> viewSavingsAccount(Principal principal);

	ResponseEntity<ResponseDto> createSavingsAccount(Principal principal, SavingAccountDto accountDto);

	ResponseEntity<ResponseDto> checkBalance(Principal prinicpal);

	ResponseEntity<ResponseDto> deposit(Principal principal, com.jsp.ebanking.dto.DepositDto dto);

	ResponseEntity<ResponseDto> confirmPayment(String razorpayOrderId, String razorpay_payment_id,
			String razorpay_signature, Principal principal);

	ResponseEntity<ResponseDto> transfer(Principal principal, TransferDto dto);

	ResponseEntity<ResponseDto> createTransferOrder(Principal principal, TransferDto dto);

	ResponseEntity<ResponseDto> confirmTransfer(Principal principal, TransferDto dto, String razorpayOrderId, String razorpay_payment_id, String razorpay_signature);

}

package com.jsp.ebanking.service;

import org.springframework.http.ResponseEntity;

import com.jsp.ebanking.dto.OtpDto;
import com.jsp.ebanking.dto.ResetPasswordDto;
import com.jsp.ebanking.dto.ResponseDto;
import com.jsp.ebanking.dto.UserDto;

public interface UserService {


	ResponseEntity<ResponseDto> register(UserDto dto);

	ResponseEntity<ResponseDto> verifyOtp(OtpDto dto);

	ResponseEntity<ResponseDto> resendOtp(String email);

	ResponseEntity<ResponseDto> forgotPassword(String email);

	ResponseEntity<ResponseDto> resetPassword(ResetPasswordDto dto);
}

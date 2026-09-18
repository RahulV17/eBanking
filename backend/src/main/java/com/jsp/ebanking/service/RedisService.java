package com.jsp.ebanking.service;

import java.time.Duration;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.jsp.ebanking.dto.UserDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RedisService {

	private final RedisTemplate<String, Object> redisTemplate;

	public void saveUserDto(UserDto dto) {
		redisTemplate.opsForValue().set("dto:" + dto.getEmail(), dto, Duration.ofMinutes(15));
	}

	public void saveUserOtp(String email, int otp) {
		// OTP valid for 5 minutes; brute-force window kept short.
		redisTemplate.opsForValue().set("otp:" + email, otp, Duration.ofMinutes(5));
	}

	public int fetchOtp(String email) {
		Object otp = redisTemplate.opsForValue().get("otp:" + email);
		if (otp != null)
			return (int) otp;
		else
			return 0;
	}

	// --- OTP brute-force protection (CRITICAL fix T3) ---
	private static final int MAX_OTP_ATTEMPTS = 5;
	private static final int OTP_LOCK_MINUTES = 15;

	public void incrementOtpAttempt(String email) {
		redisTemplate.opsForValue().increment("otp:attempts:" + email);
		redisTemplate.expire("otp:attempts:" + email, Duration.ofMinutes(OTP_LOCK_MINUTES));
	}

	public int getOtpAttempts(String email) {
		Object a = redisTemplate.opsForValue().get("otp:attempts:" + email);
		return a == null ? 0 : ((Number) a).intValue();
	}

	public boolean isOtpLocked(String email) {
		return getOtpAttempts(email) >= MAX_OTP_ATTEMPTS;
	}

	public void resetOtpAttempts(String email) {
		redisTemplate.delete("otp:attempts:" + email);
	}


	public UserDto fetchUserDto(String email) {
		return (UserDto) redisTemplate.opsForValue().get("dto:" + email);
	}

	public void deleteUserDto(String email) {
		redisTemplate.delete("dto:" + email);
	}

	public void deleteUserOtp(String email) {
		redisTemplate.delete("otp:" + email);
	}

	public void saveTransferOrder(String orderId, String userEmail, String recipientMobile, double amountRupees) {
		java.util.Map<String, Object> orderDetails = new java.util.LinkedHashMap<>();
		orderDetails.put("userEmail", userEmail);
		orderDetails.put("recipientMobile", recipientMobile);
		orderDetails.put("amountRupees", amountRupees);
		redisTemplate.opsForValue().set("transfer-order:" + orderId, orderDetails, java.time.Duration.ofMinutes(15));
	}

	public Object fetchTransferOrder(String orderId) {
		return redisTemplate.opsForValue().get("transfer-order:" + orderId);
	}

	// --- Login rate limiting (S4) — same pattern as OTP lockout ---
	private static final int MAX_LOGIN_ATTEMPTS = 5;
	private static final int LOGIN_LOCK_MINUTES = 15;

	public void incrementLoginAttempt(String email) {
		redisTemplate.opsForValue().increment("login:attempts:" + email);
		redisTemplate.expire("login:attempts:" + email, Duration.ofMinutes(LOGIN_LOCK_MINUTES));
	}

	public int getLoginAttempts(String email) {
		Object a = redisTemplate.opsForValue().get("login:attempts:" + email);
		return a == null ? 0 : ((Number) a).intValue();
	}

	public boolean isLoginLocked(String email) {
		return getLoginAttempts(email) >= MAX_LOGIN_ATTEMPTS;
	}

	public void resetLoginAttempts(String email) {
		redisTemplate.delete("login:attempts:" + email);
	}

}

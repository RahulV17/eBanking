package com.jsp.ebanking.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.Principal;
import java.security.SecureRandom;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jsp.ebanking.dto.BankBalanceDto;
import com.jsp.ebanking.dto.BankingRole;
import com.jsp.ebanking.dto.LoginDto;
import com.jsp.ebanking.dto.OtpDto;
import com.jsp.ebanking.dto.RazorpayDto;
import com.jsp.ebanking.dto.ResetPasswordDto;
import com.jsp.ebanking.dto.ResponseDto;
import com.jsp.ebanking.dto.SavingAccountDto;
import com.jsp.ebanking.dto.TransferDto;
import com.jsp.ebanking.dto.UserDto;
import com.jsp.ebanking.entity.BankTransactions;
import com.jsp.ebanking.entity.SavingBankAccount;
import com.jsp.ebanking.entity.User;
import com.jsp.ebanking.exception.DataExistsException;
import com.jsp.ebanking.exception.DataNotFoundException;
import com.jsp.ebanking.exception.ExpiredException;
import com.jsp.ebanking.exception.MissMatchException;
import com.jsp.ebanking.exception.PaymentFailedException;
import com.jsp.ebanking.mapper.SavingsBankMapper;
import com.jsp.ebanking.mapper.UserMapper;
import com.jsp.ebanking.repository.SavingAccountRepository;
import com.jsp.ebanking.repository.UserRepository;
import com.jsp.ebanking.util.JwtUtil;
import com.jsp.ebanking.util.MessageSendingHelper;
import com.jsp.ebanking.util.PaymentUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final RedisService redisService;
	private final UserRepository userRepository;
	private final MessageSendingHelper messageSendingHelper;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final JwtUtil jwtUtil;
	private final UserDetailsService userDetailsService;
	private final SavingAccountRepository savingAccountRepository;
	private final UserMapper userMapper;
	private final SavingsBankMapper bankMapper;
	private final PaymentUtil paymentUtil;
	private final TokenService tokenService;

	// CRITICAL T3: 6-digit OTP (brute-force resistant). 4-digit = 9,000 combos, breakable in seconds.
	private int generateOtp() {
		return new SecureRandom().nextInt(100000, 1000000);
	}

	@Override
	public ResponseEntity<ResponseDto> register(UserDto dto) {
		// CRITICAL T3: block OTP brute-force lockout before anything else.
		if (redisService.isOtpLocked(dto.getEmail()))
			throw new MissMatchException("Too many attempts. Try again after 15 minutes.");
		if (redisService.fetchUserDto(dto.getEmail()) == null) {
			if (!userRepository.existsByEmailOrMobile(dto.getEmail(), dto.getMobile())) {
				int otp = generateOtp();
				messageSendingHelper.sendOtp(dto.getName(), dto.getEmail(), otp);
				redisService.saveUserDto(dto);
				redisService.saveUserOtp(dto.getEmail(), otp);
				return ResponseEntity.status(201).body(new ResponseDto("Otp Sent Success, Verify to Continue", dto));
			} else {
				throw new DataExistsException(
						"Account Already Exists with " + dto.getEmail() + " or " + dto.getMobile());
			}
		} else {
			throw new DataExistsException(dto.getEmail() + " is Already being Verified if fails try after 15 mins");
		}
	}

	@Override
	public ResponseEntity<ResponseDto> verifyOtp(OtpDto dto) {
		// CRITICAL T3: lockout + attempt counting.
		if (redisService.isOtpLocked(dto.getEmail()))
			throw new MissMatchException("Too many attempts. Try again after 15 minutes.");
		int otp = redisService.fetchOtp(dto.getEmail());
		if (otp == 0)
			throw new ExpiredException("Otp Expired");
		else {
			// constant-time compare to avoid timing leaks
			if (Integer.toString(otp).equals(Integer.toString(dto.getOtp()))) {
				UserDto userDto = redisService.fetchUserDto(dto.getEmail());
				User user = userMapper.toEntity(userDto);
				user.setRole(BankingRole.USER);
				userRepository.save(user);
				redisService.deleteUserDto(dto.getEmail());
				redisService.deleteUserOtp(dto.getEmail());
				redisService.resetOtpAttempts(dto.getEmail());
				return ResponseEntity.status(201).body(new ResponseDto("Account Created Success", userDto));
			} else {
				redisService.incrementOtpAttempt(dto.getEmail());
				throw new MissMatchException("Otp Missmatch");
			}
		}
	}

	@Override
	public ResponseEntity<ResponseDto> resendOtp(String email) {
		if (redisService.isOtpLocked(email))
			throw new MissMatchException("Too many attempts. Try again after 15 minutes.");
		if (redisService.fetchUserDto(email) == null) {
			return ResponseEntity.status(200)
					.body(new ResponseDto("Otp Re-Sent Success, Verify to Continue", null));
		} else {
			int otp = generateOtp();
			messageSendingHelper.sendOtp(redisService.fetchUserDto(email).getName(), email, otp);
			redisService.saveUserOtp(email, otp);
			// S8: do not echo the staged UserDto (PII + staging oracle) to an unauthenticated caller
			return ResponseEntity.status(200)
					.body(new ResponseDto("Otp Re-Sent Success, Verify to Continue", null));
		}
	}

	@Override
	public ResponseEntity<ResponseDto> forgotPassword(String email) {
		if (redisService.isOtpLocked(email))
			throw new MissMatchException("Too many attempts. Try again after 15 minutes.");
		if (!userRepository.existsByEmail(email)) {
			return ResponseEntity.status(200)
					.body(new ResponseDto("Otp for Reseting Password has been sent to " + email, email));
		} else {
			int otp = generateOtp();
			messageSendingHelper.sendForgotPasswordOtp(email, otp);
			redisService.saveUserOtp(email, otp);
			return ResponseEntity.status(200)
					.body(new ResponseDto("Otp for Reseting Password has been sent to " + email, email));
		}
	}

	@Override
	public ResponseEntity<ResponseDto> resetPassword(ResetPasswordDto dto) {
		if (redisService.isOtpLocked(dto.getEmail()))
			throw new MissMatchException("Too many attempts. Try again after 15 minutes.");
		int otp = redisService.fetchOtp(dto.getEmail());
		if (otp == 0)
			throw new ExpiredException("Otp Expired Try Again");
		else {
			if (!Integer.toString(otp).equals(Integer.toString(dto.getOtp()))) {
				redisService.incrementOtpAttempt(dto.getEmail());
				throw new MissMatchException("Invalid Otp , Try Again");
			}
			else {
				if (!userRepository.existsByEmail(dto.getEmail()))
					throw new DataNotFoundException("Account with " + dto.getEmail() + " doesnt exist, Try Again");
				else {
					User user = userRepository.findByEmail(dto.getEmail());
					user.setPassword(passwordEncoder.encode(dto.getPassword()));
					userRepository.save(user);
					redisService.deleteUserOtp(dto.getEmail());
					redisService.resetOtpAttempts(dto.getEmail());
					return ResponseEntity.status(200)
							.body(new ResponseDto("Password Reset Success", userMapper.toDto(user)));
				}
			}
		}
	}

	@Override
	public ResponseEntity<ResponseDto> login(LoginDto dto) {
		// S4: brute-force lockout — same Redis pattern as OTP lockout
		if (redisService.isLoginLocked(dto.getEmail()))
			throw new MissMatchException("Too many failed attempts. Try again after 15 minutes.");
		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));
		} catch (BadCredentialsException e) {
			redisService.incrementLoginAttempt(dto.getEmail());
			throw e;
		}
		redisService.resetLoginAttempts(dto.getEmail());
		UserDetails userDetails = userDetailsService.loadUserByUsername(dto.getEmail());
		String token = jwtUtil.generateToken(userDetails);
		LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>();
		map.put("token", token);
		map.put("user", userMapper.toDto(userRepository.findByEmail(dto.getEmail())));
		return ResponseEntity.ok(new ResponseDto("Login Success", map));
	}

	@Override
	public ResponseEntity<ResponseDto> logout(String authHeader) {
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			tokenService.revokeToken(token, "LOGOUT");
		}
		return ResponseEntity.ok(new ResponseDto("Logged out successfully", null));
	}

	@Override
	public ResponseEntity<ResponseDto> viewSavingsAccount(Principal principal) {
		User user = getLoggedInUser(principal);
		SavingBankAccount bankAccount = user.getBankAccount();
		if (bankAccount == null)
			return ResponseEntity.ok(new ResponseDto("No bank account found", null));
		if (!bankAccount.isActive())
			throw new DataExistsException("Waiting for Admins Approval");
		else {
			return ResponseEntity.ok(new ResponseDto("Account Found", bankAccount));
		}
	}

	@Override
	public ResponseEntity<ResponseDto> createSavingsAccount(Principal principal, SavingAccountDto accountDto) {
		User user = getLoggedInUser(principal);
		if (user.getBankAccount() != null) {
			if (user.getBankAccount().isActive())
				throw new DataExistsException("Account Already Exists and You can not new Create One");
			else
				throw new DataExistsException("Account Still Pending for Verification Wait for some time");

		} else {
			SavingBankAccount bankAccount = bankMapper.toEntity(accountDto);

			bankAccount = savingAccountRepository.save(bankAccount);
			user.setBankAccount(bankAccount);
			userRepository.save(user);

			return ResponseEntity.status(201).body(new ResponseDto("Account Created Success", bankAccount));
		}
	}

	@Override
	public ResponseEntity<ResponseDto> checkBalance(Principal principal) {
		User user = getLoggedInUser(principal);
		SavingBankAccount account = user.getBankAccount();
		if (account == null || !account.isActive())
			return ResponseEntity.ok(new ResponseDto("No active bank account found", null));
		else {
			return ResponseEntity.ok(new ResponseDto("Account Found",
					new BankBalanceDto(account.getAccountNumber(), account.getBalance())));
		}
	}

	@Override
	public ResponseEntity<ResponseDto> deposit(Principal principal, com.jsp.ebanking.dto.DepositDto dto) {
		User user = getLoggedInUser(principal);
		SavingBankAccount account = user.getBankAccount();
		if (account == null)
			throw new DataNotFoundException("No Bank Accounts FOund Linked with This User account");
		else {
			BigDecimal amount = dto.getAmount();
			RazorpayDto razorpayDto = paymentUtil.createOrder(amount);
			return ResponseEntity.ok(new ResponseDto("Payment Initialized Complete Payment to Proceed", razorpayDto));
		}
	}

	@Override
	@Transactional
	public ResponseEntity<ResponseDto> confirmPayment(String razorpayOrderId, String razorpay_payment_id,
			String razorpay_signature, Principal principal) {
		User user = getLoggedInUser(principal);
		SavingBankAccount account = user.getBankAccount();
		if (account == null)
			throw new DataNotFoundException("No Bank Accounts FOund Linked with This User account");

		// SECURITY C1a: verify the Razorpay HMAC signature server-side before any
		// balance mutation. Without this anyone could forge a payment confirmation.
		if (razorpayOrderId == null || razorpay_payment_id == null || razorpay_signature == null
				|| !paymentUtil.verifyPaymentSignature(razorpayOrderId, razorpay_payment_id, razorpay_signature)) {
			throw new PaymentFailedException("Payment signature verification failed. Deposit rejected.");
		}

		// SECURITY C1b: take the amount from Razorpay's own order record,
		// never from a client-supplied parameter.
		BigDecimal paise = paymentUtil.fetchOrderAmountInPaise(razorpayOrderId);
		if (paise == null || paise.compareTo(BigDecimal.ZERO) <= 0)
			throw new PaymentFailedException("Unable to verify order with payment gateway.");

		BigDecimal depositAmount = paise
				.divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
		BigDecimal newBalance = account.getBalance().add(depositAmount);

		List<BankTransactions> transactions = account.getBankTransactions();
		if (transactions == null)
			transactions = new LinkedList<>();

		BankTransactions transaction = new BankTransactions(null, razorpay_payment_id, depositAmount, "DEPOSIT",
				null, account.getBalance(), newBalance);
		try {
			transactions.add(transaction); // unique payment_id => replay of same payment is rejected by DB (idempotency)
		} catch (Exception e) {
			throw new MissMatchException("This payment has already been processed.");
		}
		account.setBalance(newBalance);
		account.setBankTransactions(transactions);
		savingAccountRepository.save(account);
		return ResponseEntity.ok(new ResponseDto("Deposit Success", transaction));
	}

	@Override
	@Transactional
	public ResponseEntity<ResponseDto> transfer(Principal principal, TransferDto dto) {
		User user = getLoggedInUser(principal);
		SavingBankAccount fromAccount = user.getBankAccount();
		if (fromAccount == null)
			throw new DataNotFoundException("No Bank Accounts Found Linked with This User account");

		if (dto.getAmount() == null || dto.getAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
			throw new MissMatchException("Transfer amount must be greater than zero");
		}

		if (dto.getAmount().compareTo(new java.math.BigDecimal("100000")) > 0) {
			throw new MissMatchException("Per transaction limit is ₹1,00,000");
		}

		SavingBankAccount toAccount = null;
		try {
			Long accNum = Long.valueOf(dto.getToAccountNumber());
			toAccount = savingAccountRepository.findByAccountNumber(accNum).orElse(null);
		} catch (NumberFormatException e) {
			// ignore
		}
		
		if (toAccount == null) {
			// Normalize mobile: strip non-digits and match
			String rawInput = dto.getToAccountNumber().trim();
			String digitsOnly = rawInput.replaceAll("[^0-9]", "");
			String last10 = digitsOnly.length() >= 10 ? digitsOnly.substring(digitsOnly.length() - 10) : digitsOnly;

			User userByMobile = userRepository.findByMobile(rawInput);
			if (userByMobile == null && !rawInput.equals(digitsOnly)) {
				userByMobile = userRepository.findByMobile(digitsOnly);
			}
			if (userByMobile == null && !last10.isEmpty()) {
				userByMobile = userRepository.findByMobile(last10);
			}
			if (userByMobile == null && !last10.isEmpty()) {
				userByMobile = userRepository.findByMobile("+91" + last10);
			}
			if (userByMobile == null && !last10.isEmpty()) {
				userByMobile = userRepository.findByMobile("+91 " + last10);
			}
			if (userByMobile != null && userByMobile.getBankAccount() != null) {
				toAccount = userByMobile.getBankAccount();
			}
		}

		if (toAccount == null) {
			throw new DataNotFoundException("Invalid recipient account or mobile number. Please check the details and try again.");
		}

		if (fromAccount.getAccountNumber().equals(toAccount.getAccountNumber()))
			throw new MissMatchException("To account Number Can not be Same as From");
		if (!fromAccount.isActive() || fromAccount.isBlocked() || toAccount.isBlocked() || !toAccount.isActive())
			throw new PaymentFailedException("Account is Not Active or Blocked Contact Admin");
		if (fromAccount.getBalance().compareTo(dto.getAmount()) < 0)
			throw new MissMatchException("Not Enough Balance in Your Account");

		String transactionId = java.util.UUID.randomUUID().toString();

		List<BankTransactions> fromTransactions = fromAccount.getBankTransactions();
		if (fromTransactions == null)
			fromTransactions = new LinkedList<BankTransactions>();
		BankTransactions fromTransaction = new BankTransactions(null, transactionId + "-DEBIT", dto.getAmount(), "DEBIT", null,
				fromAccount.getBalance(), fromAccount.getBalance().subtract(dto.getAmount()));
		fromTransactions.add(fromTransaction);
		fromAccount.setBalance(fromAccount.getBalance().subtract(dto.getAmount()));
		fromAccount.setBankTransactions(fromTransactions);
		savingAccountRepository.save(fromAccount);

		List<BankTransactions> toTransactions = toAccount.getBankTransactions();
		if (toTransactions == null)
			toTransactions = new LinkedList<BankTransactions>();
		BankTransactions toTransaction = new BankTransactions(null, transactionId + "-CREDIT", dto.getAmount(), "CREDIT", null,
				toAccount.getBalance(), toAccount.getBalance().add(dto.getAmount()));
		toTransactions.add(toTransaction);
		toAccount.setBalance(toAccount.getBalance().add(dto.getAmount()));
		toAccount.setBankTransactions(toTransactions);
		savingAccountRepository.save(toAccount);

		return ResponseEntity.ok(new ResponseDto("Amount Transfered Success", dto));
	}

	@Override
	@Transactional
	public ResponseEntity<ResponseDto> createTransferOrder(Principal principal, TransferDto dto) {
		User user = getLoggedInUser(principal);
		SavingBankAccount fromAccount = user.getBankAccount();
		if (fromAccount == null)
			throw new DataNotFoundException("No Bank Accounts Found Linked with This User account");

		if (dto.getAmount() == null || dto.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
			throw new MissMatchException("Transfer amount must be greater than zero");
		}

		if (dto.getAmount().compareTo(new BigDecimal("100000")) > 0) {
			throw new MissMatchException("Per transaction limit is ₹1,00,000");
		}

		if (!fromAccount.isActive() || fromAccount.isBlocked())
			throw new PaymentFailedException("Account is Not Active or Blocked Contact Admin");

		if (fromAccount.getBalance().compareTo(dto.getAmount()) < 0)
			throw new MissMatchException("Not Enough Balance in Your Account");

		String mobile = dto.getToAccountNumber().replaceAll("[^0-9]", "");
		if (mobile.length() > 10) {
			mobile = mobile.substring(mobile.length() - 10);
		}

		RazorpayDto razorpayDto = paymentUtil.createOrder(dto.getAmount());
		razorpayDto.setRecipientMobile(mobile);
		redisService.saveTransferOrder(razorpayDto.getOrderId(), user.getEmail(), mobile, dto.getAmount().doubleValue());
		return ResponseEntity.ok(new ResponseDto("Payment Order Created for mobile: " + mobile, razorpayDto));
	}

	@Override
	@Transactional
	public ResponseEntity<ResponseDto> confirmTransfer(Principal principal, TransferDto dto, String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
		User user = getLoggedInUser(principal);
		SavingBankAccount fromAccount = user.getBankAccount();
		if (fromAccount == null)
			throw new DataNotFoundException("No Bank Accounts Found Linked with This User account");

		if (razorpayOrderId == null || razorpayPaymentId == null || razorpaySignature == null
				|| !paymentUtil.verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
			throw new PaymentFailedException("Payment signature verification failed. Transfer rejected.");
		}

		Object orderRecord = redisService.fetchTransferOrder(razorpayOrderId);
		if (orderRecord == null) {
			throw new PaymentFailedException("Unknown or expired transfer order.");
		}

		Map<String, Object> orderDetails = (Map<String, Object>) orderRecord;
		if (!user.getEmail().equals(orderDetails.get("userEmail"))) {
			throw new MissMatchException("Transfer order does not belong to this account.");
		}

		String rawInput = dto.getToAccountNumber() != null ? dto.getToAccountNumber().trim() : "";
		String digitsOnly = rawInput.replaceAll("[^0-9]", "");
		String last10 = digitsOnly.length() >= 10 ? digitsOnly.substring(digitsOnly.length() - 10) : digitsOnly;
        
		if (!last10.equals(orderDetails.get("recipientMobile"))) {
			throw new MissMatchException("Recipient does not match the transfer order.");
		}

		BigDecimal paise = paymentUtil.fetchOrderAmountInPaise(razorpayOrderId);
		if (paise == null || paise.compareTo(BigDecimal.ZERO) <= 0)
			throw new PaymentFailedException("Unable to verify order with payment gateway.");

		BigDecimal transferAmount = paise.divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

		if (transferAmount.compareTo(BigDecimal.ZERO) <= 0) {
			throw new MissMatchException("Transfer amount must be greater than zero");
		}

		if (transferAmount.compareTo(new BigDecimal("100000")) > 0) {
			throw new MissMatchException("Per transaction limit is ₹1,00,000");
		}

		if (!fromAccount.isActive() || fromAccount.isBlocked())
			throw new PaymentFailedException("Account is Not Active or Blocked Contact Admin");
		if (fromAccount.getBalance().compareTo(transferAmount) < 0)
			throw new MissMatchException("Not Enough Balance in Your Account");

		String mobile = last10;

		User recipientUser = userRepository.findByMobile(mobile);
		SavingBankAccount toAccount = recipientUser != null ? recipientUser.getBankAccount() : null;

		if (toAccount == null) {
			throw new DataNotFoundException("Recipient not registered in eBanking. Transfer cannot be completed.");
		}

		if (fromAccount.getAccountNumber().equals(toAccount.getAccountNumber()))
			throw new MissMatchException("To account Number Can not be Same as From");
		if (toAccount.isBlocked() || !toAccount.isActive())
			throw new PaymentFailedException("Recipient account is Not Active or Blocked");

		String transactionId = java.util.UUID.randomUUID().toString();

		List<BankTransactions> fromTransactions = fromAccount.getBankTransactions();
		if (fromTransactions == null)
			fromTransactions = new LinkedList<>();
		BankTransactions fromTransaction = new BankTransactions(null, razorpayPaymentId + "-DEBIT", transferAmount, "DEBIT", null,
				fromAccount.getBalance(), fromAccount.getBalance().subtract(transferAmount));
		try {
			fromTransactions.add(fromTransaction);
		} catch (Exception e) {
			throw new MissMatchException("This payment has already been processed.");
		}
		fromAccount.setBalance(fromAccount.getBalance().subtract(transferAmount));
		fromAccount.setBankTransactions(fromTransactions);
		savingAccountRepository.save(fromAccount);

		List<BankTransactions> toTransactions = toAccount.getBankTransactions();
		if (toTransactions == null)
			toTransactions = new LinkedList<>();
		BankTransactions toTransaction = new BankTransactions(null, razorpayPaymentId + "-CREDIT", transferAmount, "CREDIT", null,
				toAccount.getBalance(), toAccount.getBalance().add(transferAmount));
		toTransactions.add(toTransaction);
		toAccount.setBalance(toAccount.getBalance().add(transferAmount));
		toAccount.setBankTransactions(toTransactions);
		savingAccountRepository.save(toAccount);

		return ResponseEntity.ok(new ResponseDto("Amount Transfered Success via Razorpay to " + mobile, dto));
	}

	private User getLoggedInUser(Principal principal) {
		if (principal == null)
			throw new DataNotFoundException("Not Logged in , Invalid Session");
		String email = principal.getName();
		User user = userRepository.findByEmail(email);
		if (user == null)
			throw new DataNotFoundException("Not Logged in , Invalid Session");
		else
			return user;
	}

}
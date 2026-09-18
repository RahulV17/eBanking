package com.jsp.ebanking.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TransferDto {
	// S11: server-side validation on money endpoints — never trust client amounts.
	// Range [0.01, 100000] mirrors the service-layer checks; Razorpay-confirmed
	// transfers re-derive the amount server-side, this guards the direct paths.
	@NotNull(message = "Amount is Required")
	@Positive(message = "Transfer amount must be greater than zero")
	@DecimalMax(value = "100000", message = "Per transaction limit is ₹1,00,000")
	private BigDecimal amount;
	@NotBlank(message = "Recipient account or mobile number is Required")
	private String toAccountNumber;
	private String description;
	private String razorpayOrderId;
}
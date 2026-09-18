package com.jsp.ebanking.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RazorpayDto {
	private String orderId;
	private BigDecimal amount;
	private String key;
	private String currency;
	private String recipientMobile;

	public RazorpayDto(String orderId, BigDecimal amount, String key, String currency) {
		this.orderId = orderId;
		this.amount = amount;
		this.key = key;
		this.currency = currency;
		this.recipientMobile = null;
	}
}

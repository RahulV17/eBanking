package com.jsp.ebanking.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class BankBalanceDto {
	private Long accountNumber;
	private BigDecimal balance;
}

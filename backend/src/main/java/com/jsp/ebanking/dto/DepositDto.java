package com.jsp.ebanking.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class DepositDto {
    @NotNull
    @Positive
    @DecimalMax(value = "100000", message = "Per transaction limit is ₹1,00,000")
    private BigDecimal amount;
}

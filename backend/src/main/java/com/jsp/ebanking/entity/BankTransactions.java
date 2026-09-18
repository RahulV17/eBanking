package com.jsp.ebanking.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class BankTransactions {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	// Unique: prevents replay of the same Razorpay payment crediting balance twice (idempotency)
	@Column(unique = true, nullable = false)
	private String payment_id;
	private BigDecimal amount;
	private String type;
	@CreationTimestamp
	private LocalDateTime createdTime;
	private BigDecimal balanceBeforeTransaction;
	private BigDecimal balanceAfterTransaction;
}

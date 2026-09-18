package com.jsp.ebanking.entity;

import java.math.BigDecimal;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class SavingBankAccount {
	@Id
	@GeneratedValue(generator = "ACNO")
	@SequenceGenerator(name = "ACNO", initialValue = 1000100101, allocationSize = 1)
	private Long accountNumber;
	@Version
	private Long version = 0L;
	@Column(nullable = false)
	private String address;
	@Column(nullable = false)
	private String ifscCode;
	@Column(nullable = false)
	private String fullName;
	@Column(nullable = false)
	private String panNumber;
	@Column(nullable = false)
	private Long aadharNumber;
	@Column(nullable = false)
	private String branch;
	@Column(nullable = false)
	private BigDecimal balance;
	private boolean active;
	private boolean blocked;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	List<BankTransactions> bankTransactions;
}
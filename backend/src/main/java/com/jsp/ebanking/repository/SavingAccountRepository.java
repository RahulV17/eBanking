package com.jsp.ebanking.repository;

import java.util.List;
import java.util.Optional;

import com.jsp.ebanking.entity.SavingBankAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavingAccountRepository extends JpaRepository<SavingBankAccount, Long> {

	List<SavingBankAccount> findByActiveFalse();

	long countByActive(boolean active);

	long countByBlocked(boolean blocked);

	Optional<SavingBankAccount> findByAccountNumber(Long accountNumber);
}

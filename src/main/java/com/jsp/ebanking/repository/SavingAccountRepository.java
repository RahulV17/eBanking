package com.jsp.ebanking.repository;

import java.util.List;

import com.jsp.ebanking.entity.SavingBankAccount;
import org.springframework.data.jpa.repository.JpaRepository;


public interface SavingAccountRepository extends JpaRepository<SavingBankAccount, Long> {

	List<SavingBankAccount> findByActiveFalse();

}
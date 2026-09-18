package com.jsp.ebanking.repository;

import java.util.List;
import java.util.Optional;

import com.jsp.ebanking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

	User findByEmail(String email);

	User findByMobile(String mobile);

	boolean existsByEmailOrMobile(String email, String mobile);

	boolean existsByEmail(String email);

	Optional<User> findByBankAccount_accountNumber(Long accountNumber);

	long countByBankAccount_Active(boolean active);
}

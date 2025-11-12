package com.jsp.ebanking.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jsp.ebanking.entity.User;

public interface UserRepository extends JpaRepository<User, Long>{

	boolean existsByEmailOrMobile(String email, String mobile);
	
	boolean existsByEmail(String email);

	User findByEmail(String email);

}

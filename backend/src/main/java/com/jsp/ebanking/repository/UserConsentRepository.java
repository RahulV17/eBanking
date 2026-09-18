package com.jsp.ebanking.repository;

import com.jsp.ebanking.entity.UserConsent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserConsentRepository extends JpaRepository<UserConsent, Long> {
    UserConsent findByUserEmail(String email);
}

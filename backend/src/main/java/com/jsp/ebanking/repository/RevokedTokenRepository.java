package com.jsp.ebanking.repository;

import com.jsp.ebanking.entity.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RevokedTokenRepository extends JpaRepository<RevokedToken, Long> {
    
    boolean existsByTokenJti(String tokenJti);
    
    boolean existsByTokenHash(String tokenHash);
    
    void deleteByExpiresAtBefore(java.util.Date now);
}

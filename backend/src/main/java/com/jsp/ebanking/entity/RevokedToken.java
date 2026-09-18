package com.jsp.ebanking.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "revoked_tokens")
public class RevokedToken {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "token_jti", unique = true, nullable = false, length = 255)
    private String tokenJti; // JWT ID (jti claim) - unique identifier for the token
    
    @Column(name = "token_hash", nullable = false, length = 500)
    private String tokenHash; // SHA-256 hash of the token
    
    @Column(name = "user_email", nullable = false)
    private String userEmail;
    
    @Column(name = "revoked_at", nullable = false)
    private Date revokedAt;
    
    @Column(name = "expires_at", nullable = false)
    private Date expiresAt;
    
    @Column(name = "reason", length = 100)
    private String reason; // LOGOUT, PASSWORD_CHANGE, SESSION_EXPIRED, ADMIN_REVOKED
    
    @Column(name = "ip_address", length = 45)
    private String ipAddress;
    
    public RevokedToken(String tokenJti, String tokenHash, String userEmail, Date expiresAt, String reason) {
        this.tokenJti = tokenJti;
        this.tokenHash = tokenHash;
        this.userEmail = userEmail;
        this.revokedAt = new Date();
        this.expiresAt = expiresAt;
        this.reason = reason;
    }
}

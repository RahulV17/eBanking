package com.jsp.ebanking.service;

import com.jsp.ebanking.entity.RevokedToken;
import com.jsp.ebanking.repository.RevokedTokenRepository;
import com.jsp.ebanking.util.JwtUtil;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.HexFormat;

@Service
public class TokenService {

    private final RevokedTokenRepository revokedTokenRepository;
    private final JwtUtil jwtUtil;

    public TokenService(RevokedTokenRepository revokedTokenRepository, JwtUtil jwtUtil) {
        this.revokedTokenRepository = revokedTokenRepository;
        this.jwtUtil = jwtUtil;
    }

    public boolean isTokenRevoked(String token) {
        try {
            String jti = jwtUtil.extractJti(token);
            if (jti != null && revokedTokenRepository.existsByTokenJti(jti)) {
                return true;
            }
            String hash = hashToken(token);
            return revokedTokenRepository.existsByTokenHash(hash);
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public void revokeToken(String token, String reason) {
        try {
            String jti = jwtUtil.extractJti(token);
            String userEmail = jwtUtil.extractUsername(token);
            Date expiresAt = jwtUtil.extractExpiration(token);
            String hash = hashToken(token);

            RevokedToken revoked = new RevokedToken(
                jti,
                hash,
                userEmail,
                expiresAt,
                reason
            );
            revokedTokenRepository.save(revoked);
        } catch (Exception e) {
            // Token might be expired/invalid, ignore
        }
    }

    @Scheduled(cron = "0 0 3 * * ?") // Run daily at 3 AM
    @Transactional
    public void cleanupExpiredTokens() {
        revokedTokenRepository.deleteByExpiresAtBefore(new Date());
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes());
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            return token.substring(0, Math.min(token.length(), 100));
        }
    }
}

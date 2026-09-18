package com.jsp.ebanking.util;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.jsp.ebanking.exception.GlobalExceptionHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	private final Key key;
	private final long expirationMillis;

	/**
	 * SECURITY M1: expiry is now configurable via ${jwt.expiration-ms} (default 1h).
	 * Secret must be at least 32 bytes (256 bits) for HS256 — validated at startup.
	 */
	public JwtUtil(@Value("${jwt.secret}") String secretKey,
			@Value("${jwt.expiration-ms:3600000}") long expirationMillis,
			GlobalExceptionHandler globalExceptionHandler) {
		byte[] decoded = Decoders.BASE64.decode(secretKey);
		if (decoded.length < 32) {
			throw new IllegalArgumentException(
				"jwt.secret must be a Base64-encoded key of at least 32 bytes (256 bits) for HS256. "
				+ "Generate one with: openssl rand -base64 32");
		}
		this.key = Keys.hmacShaKeyFor(decoded);
		this.expirationMillis = expirationMillis;
	}

	public String generateToken(UserDetails userDetails) {
		Map<String, Object> claims = new HashMap<>();
		String role = userDetails.getAuthorities().iterator().next().getAuthority();
		claims.put("role", role);

		// Add unique token ID for revocation tracking
		String jti = UUID.randomUUID().toString();
		claims.put("jti", jti);

		return Jwts.builder().claims(claims).subject(userDetails.getUsername())
				.issuedAt(new Date(System.currentTimeMillis()))
				.expiration(new Date(System.currentTimeMillis() + expirationMillis)).signWith(key).compact();
	}

	public String extractUsername(String token) {
		return extractAllClaims(token).getSubject();
	}

	public String extractJti(String token) {
		return extractAllClaims(token).get("jti", String.class);
	}

	public SimpleGrantedAuthority extractRole(String token) {
		Claims claims = extractAllClaims(token);
		String role = claims.get("role", String.class);
		return new SimpleGrantedAuthority(role);
	}

	public Date extractExpiration(String token) {
		return extractAllClaims(token).getExpiration();
	}

	public boolean validateToken(String token, UserDetails userDetails) {
		final String username = extractUsername(token);
		return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
	}

	public boolean isTokenExpired(String token) {
		return extractExpiration(token).before(new Date());
	}

	private Claims extractAllClaims(String token) {
		return Jwts.parser().setSigningKey(key).build().parseSignedClaims(token).getPayload();
	}
}

package com.jsp.ebanking.config;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.jsp.ebanking.service.TokenService;
import com.jsp.ebanking.util.JwtUtil;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
	private final JwtUtil jwtUtil;
	private final UserDetailsService userDetailsService;
	private final TokenService tokenService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		final String authorizationHeader = request.getHeader("Authorization");
		String username = null;
		String jwt = null;

		if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
			jwt = authorizationHeader.substring(7);

			// Check if token is revoked, expired, or malformed
			try {
				if (tokenService.isTokenRevoked(jwt)) {
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
					response.setContentType("application/json");
					response.getWriter().write("{\"error\":\"Token has been revoked. Please login again.\",\"message\":\"Token has been revoked. Please login again.\"}");
					return;
				}
			} catch (ExpiredJwtException e) {
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				response.setContentType("application/json");
				response.getWriter().write("{\"error\":\"Token expired. Please login again.\",\"message\":\"Token expired. Please login again.\"}");
				return;
			} catch (JwtException | IllegalArgumentException e) {
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				response.setContentType("application/json");
				response.getWriter().write("{\"error\":\"Invalid token. Please login again.\",\"message\":\"Invalid token. Please login again.\"}");
				return;
			}

			try {
				username = jwtUtil.extractUsername(jwt);
			} catch (ExpiredJwtException e) {
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				response.setContentType("application/json");
				response.getWriter().write("{\"error\":\"Token expired. Please login again.\",\"message\":\"Token expired. Please login again.\"}");
				return;
			} catch (JwtException | IllegalArgumentException e) {
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				response.setContentType("application/json");
				response.getWriter().write("{\"error\":\"Invalid token. Please login again.\",\"message\":\"Invalid token. Please login again.\"}");
				return;
			}
		}

		if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			try {
				UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

				if (jwtUtil.validateToken(jwt, userDetails)) {
					UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
							userDetails, null, userDetails.getAuthorities());
					SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
				}
			} catch (Exception e) {
				// Failed to load user or validate token
			}
		}
		filterChain.doFilter(request, response);
	}
}

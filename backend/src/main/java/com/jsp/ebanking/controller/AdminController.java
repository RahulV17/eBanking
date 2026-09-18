package com.jsp.ebanking.controller;

import com.jsp.ebanking.dto.ConsentUpdateDto;
import com.jsp.ebanking.dto.ResponseDto;
import com.jsp.ebanking.entity.UserConsent;
import com.jsp.ebanking.repository.UserConsentRepository;
import com.jsp.ebanking.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

	private final AdminService adminService;
	private final UserConsentRepository consentRepository;

	// ==================== DASHBOARD & STATS ====================

	@GetMapping("/stats")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ResponseDto> getDashboardStats() {
		return adminService.getDashboardStats();
	}

	// ==================== USER MANAGEMENT ====================

	@GetMapping("/users")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ResponseDto> getAllUsers() {
		return adminService.getAllUsers();
	}

	@GetMapping("/users/search")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ResponseDto> searchUsers(@RequestParam String q) {
		return adminService.searchUsers(q);
	}

	// ==================== ACCOUNT MANAGEMENT ====================

	@GetMapping("/banks/pending")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ResponseDto> getPendingAccounts() {
		return adminService.getPendingAccounts();
	}

	@PatchMapping("/approve/saving")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ResponseDto> approveAccount(@RequestBody Long accountNumber) {
		return adminService.approveBankAccount(accountNumber);
	}

	@GetMapping("/transactions/{accountNumber}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ResponseDto> getBankTransactions(@PathVariable Long accountNumber) {
		return adminService.getBankTransactions(accountNumber);
	}

	@PatchMapping("/block/{accountNumber}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ResponseDto> blockAccount(@PathVariable Long accountNumber) {
		return adminService.blockAccount(accountNumber);
	}

	@PatchMapping("/unblock/{accountNumber}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ResponseDto> unblockAccount(@PathVariable Long accountNumber) {
		return adminService.unblockAccount(accountNumber);
	}

	// ==================== CONSENT MANAGEMENT ====================

	@GetMapping("/consent/{email}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
	public ResponseEntity<ResponseDto> getUserConsent(@PathVariable String email, Principal principal) {
		// SECURITY H3 (IDOR): a USER may only read their own consent; ADMIN can read anyone's.
		if (!isOwnerOrAdmin(principal, email)) {
			return ResponseEntity.status(403).body(new ResponseDto("You can only view your own consent settings.", null));
		}
		UserConsent consent = consentRepository.findByUserEmail(email);
		if (consent == null) {
			consent = new UserConsent();
			consent.setUserEmail(email);
		}
		return ResponseEntity.ok(new ResponseDto("Consent Settings", consent));
	}

	@PutMapping("/consent/{email}")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<ResponseDto> updateConsent(@PathVariable String email,
			@RequestBody ConsentUpdateDto dto, Principal principal) {
		// SECURITY H3 (IDOR): a USER may only update their OWN consent settings.
		if (!isOwnerOrAdmin(principal, email)) {
			return ResponseEntity.status(403).body(new ResponseDto("You can only update your own consent settings.", null));
		}
		UserConsent consent = consentRepository.findByUserEmail(email);
		if (consent == null) {
			consent = new UserConsent();
			consent.setUserEmail(email);
		}
		consent.setAdminViewTransactions(dto.isAdminViewTransactions());
		consent.setAdminViewDocuments(dto.isAdminViewDocuments());
		consent.setMarketingConsent(dto.isMarketingConsent());
		consent.setDataSharingConsent(dto.isDataSharingConsent());
		consentRepository.save(consent);
		return ResponseEntity.ok(new ResponseDto("Consent Updated", consent));
	}

	/**
	 * SECURITY H3: ownership check — the requester must be the owner of the
	 * email path variable OR hold the ADMIN role.
	 */
	private boolean isOwnerOrAdmin(Principal principal, String email) {
		if (principal == null || email == null)
			return false;
		if (principal.getName().equalsIgnoreCase(email))
			return true;
		return org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()
				.getAuthorities().stream()
				.anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
	}
}

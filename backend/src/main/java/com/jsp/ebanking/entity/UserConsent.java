package com.jsp.ebanking.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserConsent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String userEmail;
    
    // Consent for admin to view transaction history
    private boolean adminViewTransactions = false;
    
    // Consent for admin to view personal documents
    private boolean adminViewDocuments = false;
    
    // Consent for marketing communications
    private boolean marketingConsent = false;
    
    // Consent for data sharing with third parties
    private boolean dataSharingConsent = false;
    
    private java.time.LocalDateTime updatedTime;
    
    @PreUpdate
    @PrePersist
    public void setTimestamp() {
        this.updatedTime = java.time.LocalDateTime.now();
    }
}

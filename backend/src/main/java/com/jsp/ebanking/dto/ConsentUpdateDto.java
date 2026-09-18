package com.jsp.ebanking.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsentUpdateDto {
    private boolean adminViewTransactions;
    private boolean adminViewDocuments;
    private boolean marketingConsent;
    private boolean dataSharingConsent;
}

package com.jsp.ebanking.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDto {
    private Long id;
    private String name;
    private String email;
    private String mobile;
    private String role;
    private boolean hasBankAccount;
    private boolean accountActive;
    private boolean accountBlocked;
    private boolean consentToViewTransactions;
}

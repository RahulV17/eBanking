export interface User {
  id?: string;
  name: string;
  email: string;
  mobile?: string;
  dob?: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface BankAccount {
  accountNumber: string;
  fullName: string;
  address: string;
  ifscCode: string;
  branch: string;
  panNumber?: string;
  aadharNumber?: string;
  balance: number;
  active: boolean;
  blocked: boolean;
  bankTransactions?: Transaction[];
}

export interface Transaction {
  id: string;
  payment_id: string;
  amount: number;
  type: string;
  createdTime: string;
  balanceBeforeTransaction: number;
  balanceAfterTransaction: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  blockedAccounts: number;
  pendingAccounts: number;
  totalAccounts: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  hasBankAccount: boolean;
  accountActive: boolean;
  accountBlocked: boolean;
  consentToViewTransactions: boolean;
  accountNumber?: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface ConsentSettings {
  adminViewTransactions: boolean;
  adminViewDocuments: boolean;
  marketingConsent: boolean;
  dataSharingConsent: boolean;
}

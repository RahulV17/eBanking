import { api } from '../api/client';
import type { BankAccount, Transaction, AdminStats, AdminUser, ApiResponse } from '../types';

export function useBankAccount() {
  return {
    getAccount: async (): Promise<BankAccount | null> => {
      try {
        const res = await api.get<ApiResponse<BankAccount>>('/v1/user/account/bank');
        return res.data.data;
      } catch {
        return null;
      }
    },
    createAccount: async (data: { fullName: string; address: string; pan: string; aadhar: string }) => {
      const res = await api.post<ApiResponse<BankAccount>>('/v1/user/account/bank', data);
      return res.data;
    },
  };
}

export function useAdmin() {
  return {
    getStats: async (): Promise<AdminStats | null> => {
      try {
        const res = await api.get<ApiResponse<AdminStats>>('/v1/admin/stats');
        return res.data.data;
      } catch {
        return null;
      }
    },
    getUsers: async (): Promise<AdminUser[]> => {
      try {
        const res = await api.get<ApiResponse<AdminUser[]>>('/v1/admin/users');
        return res.data.data;
      } catch {
        return [];
      }
    },
    searchUsers: async (query: string): Promise<AdminUser[]> => {
      try {
        const res = await api.get<ApiResponse<AdminUser[]>>(`/v1/admin/users/search?q=${encodeURIComponent(query)}`);
        return res.data.data;
      } catch {
        return [];
      }
    },
    getPendingAccounts: async (): Promise<any[]> => {
      try {
        const res = await api.get<ApiResponse<any[]>>('/v1/admin/banks/pending');
        return res.data.data;
      } catch {
        return [];
      }
    },
    approveAccount: async (accountNumber: string) => {
      // Backend expects @RequestBody Long accountNumber - send as raw number
      const res = await api.patch('/v1/admin/approve/saving', Number(accountNumber));
      return res.data;
    },
    blockAccount: async (accountNumber: string) => {
      const res = await api.patch(`/v1/admin/block/${accountNumber}`);
      return res.data;
    },
    unblockAccount: async (accountNumber: string) => {
      const res = await api.patch(`/v1/admin/unblock/${accountNumber}`);
      return res.data;
    },
    getTransactions: async (accountNumber: string): Promise<Transaction[]> => {
      try {
        const res = await api.get<ApiResponse<Transaction[]>>(`/v1/admin/transactions/${accountNumber}`);
        return res.data.data;
      } catch {
        return [];
      }
    },
  };
}

export function useTransfer() {
  return {
    transfer: async (data: { amount: number; toAccountNumber: string; description?: string }) => {
      const res = await api.post('/v1/user/transfer', {
        amount: data.amount,
        toAccountNumber: data.toAccountNumber,
        description: data.description,
      });
      return res.data;
    },
    createTransferOrder: async (data: { amount: number; toAccountNumber: string; description?: string }) => {
      const res = await api.post('/v1/user/transfer/order', {
        amount: data.amount,
        toAccountNumber: data.toAccountNumber,
        description: data.description,
      });
      return res.data.data;
    },
    confirmTransfer: async (data: { amount: number; toAccountNumber: string; description?: string; razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
      const res = await api.post('/v1/user/transfer/confirm', {
        amount: data.amount,
        toAccountNumber: data.toAccountNumber,
        description: data.description,
      }, {
        params: { razorpay_order_id: data.razorpay_order_id, razorpay_payment_id: data.razorpay_payment_id, razorpay_signature: data.razorpay_signature },
      });
      return res.data;
    },
  };
}

export function useAIChat() {
  return {
    sendMessage: async (message: string): Promise<string> => {
      try {
        const res = await api.post('/ai/chat', { message }, { timeout: 60000 });
        return res.data.response;
      } catch (error: any) {
        if (error.response?.status === 404) {
          throw new Error('AI service unavailable');
        }
        const messageText = error.response?.data?.message || error.message || 'Failed to send message';
        throw new Error(messageText);
      }
    },
  };
}

export function useConsent() {
  return {
    getConsent: async (email: string) => {
      try {
        const res = await api.get(`/v1/admin/consent/${email}`);
        return res.data.data;
      } catch {
        return null;
      }
    },
    updateConsent: async (email: string, data: any) => {
      const res = await api.put(`/v1/admin/consent/${email}`, data);
      return res.data;
    },
  };
}

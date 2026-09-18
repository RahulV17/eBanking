import { useState } from 'react';
import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false, // Start as false to prevent blocking
  login: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true, isLoading: false });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },
  setLoading: (loading) => set({ isLoading: loading }),
  setUser: (user) => set({ user }),
}));

// Initialize auth state from localStorage
const savedToken = localStorage.getItem('token');
const savedUser = localStorage.getItem('user');

if (savedToken && savedUser) {
  try {
    const user = JSON.parse(savedUser);
    if (user && user.email) {
      useAuthStore.setState({ user, isAuthenticated: true, isLoading: false });
    }
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

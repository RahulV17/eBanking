import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  notificationsOpen: boolean;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  toggleCommandPalette: () => void;
  toggleNotifications: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: (localStorage.getItem('theme') as Theme) || 'system',
  sidebarOpen: true,
  commandPaletteOpen: false,
  notificationsOpen: false,
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  toggleNotifications: () => set((state) => ({ notificationsOpen: !state.notificationsOpen })),
}));

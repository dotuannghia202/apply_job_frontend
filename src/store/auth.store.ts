import { create } from "zustand";
import type { AuthUser } from "@/types/auth";
import {
  clearAuthFromStorage,
  getAccessTokenFromStorage,
  getUserFromStorage,
  saveAuthToStorage,
} from "@/helper/auth-storage";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: getUserFromStorage(),
  accessToken: getAccessTokenFromStorage(),
  isAuthenticated: !!getUserFromStorage() && !!getAccessTokenFromStorage(),

  setAuth: (user, accessToken) => {
    saveAuthToStorage(user, accessToken);

    set({
      user,
      accessToken,
      isAuthenticated: true,
    });
  },

  logout: () => {
    clearAuthFromStorage();

    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },
}));

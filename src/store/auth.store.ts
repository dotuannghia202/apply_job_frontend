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
  avatarUrl: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, accessToken: string) => void;
  setAvatar: (avatarUrl: string | null) => void;
  logout: () => void;
}

const initialUser = getUserFromStorage();
const initialAccessToken = getAccessTokenFromStorage();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  accessToken: initialAccessToken,
  avatarUrl: initialUser?.avatarUrl ?? null,
  isAuthenticated: !!initialUser && !!initialAccessToken,

  setAuth: (user, accessToken) => {
    const authUser = {
      ...user,
      avatarUrl: user.avatarUrl ?? null,
    };

    saveAuthToStorage(authUser, accessToken);

    set({
      user: authUser,
      accessToken,
      avatarUrl: authUser.avatarUrl,
      isAuthenticated: true,
    });
  },

  setAvatar: (avatarUrl) => {
    set((state) => {
      const user = state.user ? { ...state.user, avatarUrl } : null;

      if (user && state.accessToken) {
        saveAuthToStorage(user, state.accessToken);
      }

      return {
        user,
        avatarUrl,
      };
    });
  },

  logout: () => {
    clearAuthFromStorage();

    set({
      user: null,
      accessToken: null,
      avatarUrl: null,
      isAuthenticated: false,
    });
  },
}));

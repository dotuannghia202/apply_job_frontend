import { create } from "zustand";
import type { AuthUser, RoleName } from "@/types/auth";
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
  company: AuthUser["company"] | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, accessToken: string) => void;
  setAvatar: (avatarUrl: string | null) => void;
  setCompany: (company: AuthUser["company"] | null) => void;
  setRoles: (roles: RoleName[]) => void;
  logout: () => void;
}

const initialUser = getUserFromStorage();
const initialAccessToken = getAccessTokenFromStorage();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  accessToken: initialAccessToken,
  avatarUrl: initialUser?.avatarUrl ?? null,
  company: initialUser?.company ?? null,
  isAuthenticated: !!initialUser && !!initialAccessToken,

  setAuth: (user, accessToken) => {
    const authUser = {
      ...user,
      avatarUrl: user.avatarUrl ?? null,
      isActive: user.isActive ?? null,
    };

    saveAuthToStorage(authUser, accessToken);

    set({
      user: authUser,
      accessToken,
      avatarUrl: authUser.avatarUrl,
      company: authUser.company ?? null,
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

  setCompany: (company) => {
    set((state) => {
      const user = state.user ? { ...state.user, company } : null;

      if (user && state.accessToken) {
        saveAuthToStorage(user, state.accessToken);
      }

      return {
        user,
        company,
      };
    });
  },

  setRoles: (roles) => {
    set((state) => {
      const user = state.user ? { ...state.user, roles } : null;

      if (user && state.accessToken) {
        saveAuthToStorage(user, state.accessToken);
      }

      return {
        user,
      };
    });
  },

  logout: () => {
    clearAuthFromStorage();

    set({
      user: null,
      accessToken: null,
      avatarUrl: null,
      company: null,
      isAuthenticated: false,
    });
  },
}));

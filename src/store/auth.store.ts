import { create } from "zustand";
import type { AuthUser, RoleName } from "@/types/auth";

interface AuthState {
  user: AuthUser | null;
  avatarUrl: string | null;
  company: AuthUser["company"] | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser) => void;
  setAvatar: (avatarUrl: string | null) => void;
  setCompany: (company: AuthUser["company"] | null) => void;
  setRoles: (roles: RoleName[]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  avatarUrl: "",
  company: null,
  isAuthenticated: false,

  setAuth: (user) => {
    const normalizedUser = {
      ...user,
      avatarUrl: user.avatarUrl ?? null,
      isActive: user.isActive ?? null,
    };

    set({
      user: normalizedUser,
      avatarUrl: normalizedUser.avatarUrl,
      company: normalizedUser.company ?? null,
      isAuthenticated: true,
    });
  },

  setAvatar: (avatarUrl) => {
    set((state) => {
      const user = state.user ? { ...state.user, avatarUrl } : null;

      return {
        user,
        avatarUrl,
      };
    });
  },

  setCompany: (company) => {
    set((state) => {
      const user = state.user ? { ...state.user, company } : null;
      return {
        user,
        company,
      };
    });
  },

  setRoles: (roles) => {
    set((state) => {
      const user = state.user ? { ...state.user, roles } : null;
      return {
        user,
      };
    });
  },

  logout: () => {
    set({
      user: null,
      avatarUrl: null,
      company: null,
      isAuthenticated: false,
    });
  },
}));

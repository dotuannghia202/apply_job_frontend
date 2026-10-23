// src/hooks/use-login.ts
import { useMutation } from "@tanstack/react-query";
import authApi from "./authApi";
import { useAuthStore } from "@/store/auth.store";

export const useLoginWithGoogle = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (credentialResponse: { credential?: string }) => {
      if (!credentialResponse?.credential) {
        throw new Error("Unable to receive a token from Google");
      }
      return await authApi.loginWithGoogle(credentialResponse.credential);
    },
    onSuccess: (res: any) => {
      // Giống cấu trúc data trả về ở LoginForm thường của bạn
      if (res?.data?.user) {
        setAuth(res.data.user);
      }
    },
  });
};

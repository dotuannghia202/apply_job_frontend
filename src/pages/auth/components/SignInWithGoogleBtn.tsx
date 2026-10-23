import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import authApi from "@/api/authentication/authApi";
import { useAuthStore } from "@/store/auth.store";
import React from "react";
import GoogleIcon from "@/components/GoogleIcon";
import { useTranslation } from "react-i18next";
import { NotificationPopup } from "@/components/NotificationPopup";

interface PopupState {
  open: boolean;
  variant: "success" | "error";
  title: string;
  message: string;
  callback?: () => void;
}

export default function SignInWithGoogleBtn() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation();

  const [popup, setPopup] = React.useState<PopupState>({
    open: false,
    variant: "error",
    title: "",
    message: "",
  });

  const handleClosePopup = () => {
    const cb = popup.callback;
    setPopup((prev) => ({ ...prev, open: false, callback: undefined }));
    cb?.();
  };

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      setLoading(true);
      try {
        // Gửi auth code lên BE
        const res: any = await authApi.loginWithGoogle(
          codeResponse.code,
        );
        if (res?.data?.user) {
          setAuth(res.data.user);
          setPopup({
            open: true,
            variant: "success",
            title: t("common.success"),
            message: t("auth.login.googleSuccess"),
            callback: () => navigate("/"),
          });
        }
      } catch (err: any) {
        setPopup({
          open: true,
          variant: "error",
          title: t("common.error"),
          message:
            err?.response?.data?.message || t("auth.login.googleError"),
        });
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setPopup({
        open: true,
        variant: "error",
        title: t("common.error"),
        message: t("auth.login.googleError"),
      });
    },
  });

  return (
    <>
      <Button
        type="button"
        variant="outline"
        disabled={loading}
        onClick={() => login()}
        className="w-full h-12 rounded-xl bg-[#283128] hover:bg-[#344034] text-white border-none transition-all flex items-center justify-center font-medium cursor-pointer"
      >
        {loading ? (
          <LoaderCircle className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <GoogleIcon />
            <span>{t("header.loginWithGoogle")}</span>
          </>
        )}
      </Button>

      <NotificationPopup
        open={popup.open}
        variant={popup.variant}
        title={popup.title}
        message={popup.message}
        dismissLabel={t("auth.common.gotIt")}
        onDismiss={handleClosePopup}
        onClose={handleClosePopup}
        closeOnBackdrop={popup.variant !== "success"}
      />
    </>
  );
}

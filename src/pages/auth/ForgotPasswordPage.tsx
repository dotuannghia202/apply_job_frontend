import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ForgotPasswordForm from "./components/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <div className="relative z-10">
        <h1 className="text-white font-bold text-xl mb-12">
          {t("auth.brand")}
        </h1>

        <div className="space-y-2 mb-8">
          <h2 className="text-4xl font-semibold text-white tracking-tight">
            {t("auth.forgotPassword.title")}
          </h2>
          <p className="text-gray-400">
            {t("auth.forgotPassword.subtitle")}
          </p>
        </div>
      </div>

      <div className="relative z-10">
        <ForgotPasswordForm />
      </div>

      <div className="mt-8 text-center relative z-10">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-gray-400 hover:text-white text-sm underline underline-offset-4 cursor-pointer"
        >
          {t("auth.forgotPassword.backToLogin")}
        </button>
      </div>
    </>
  );
};

export default ForgotPasswordPage;

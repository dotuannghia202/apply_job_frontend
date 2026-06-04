import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "./components/LoginForm";

const LoginPage = () => {
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
            {t("auth.login.title")}
          </h2>
          <p className="text-gray-400">{t("auth.login.subtitle")}</p>
        </div>
      </div>

      <div className="relative z-10">
        <LoginForm />
      </div>

      <div className="mt-8 text-center relative z-10">
        <button
          onClick={() => navigate("/register")}
          className="text-gray-400 hover:text-white text-sm underline underline-offset-4 cursor-pointer"
        >
          {t("auth.login.createAccount")}
        </button>
      </div>
    </>
  );
};

export default LoginPage;

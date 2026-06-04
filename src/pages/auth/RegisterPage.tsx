import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <div className="relative z-10">
        <h1 className="text-white font-bold text-xl mb-12">
          {t("auth.brand")}
        </h1>

        <div className="space-y-2 mb-4">
          <h2 className="text-3xl font-semibold text-white tracking-tight">
            {t("auth.register.title")}
          </h2>
          <p className="text-gray-400 mt-4">
            {t("auth.register.subtitle")}
          </p>
        </div>
      </div>

      <div className="relative z-10">
        <RegisterForm />
      </div>

      <div className="mt-8 text-center relative z-10">
        <button
          onClick={() => navigate("/login")}
          className="text-gray-400 hover:text-white text-sm underline underline-offset-4 cursor-pointer"
        >
          {t("auth.register.login")}
        </button>
      </div>
    </>
  );
};

export default RegisterPage;

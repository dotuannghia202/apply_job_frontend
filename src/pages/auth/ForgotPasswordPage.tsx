import { useNavigate } from "react-router-dom";
import ForgotPasswordForm from "./components/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="relative z-10">
        <h1 className="text-white font-bold text-xl mb-12">Job Portal</h1>

        <div className="space-y-2 mb-8">
          <h2 className="text-4xl font-semibold text-white tracking-tight">
            Forgot password
          </h2>
          <p className="text-gray-400">
            Enter your email to receive a new password.
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
          Back to login
        </button>
      </div>
    </>
  );
};

export default ForgotPasswordPage;

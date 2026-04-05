import { useNavigate } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="relative z-10">
        <h1 className="text-white font-bold text-xl mb-12">Job Portal</h1>

        <div className="space-y-2 mb-4">
          <h2 className="text-3xl font-semibold text-white tracking-tight">
            Join us to find the perfect job for you.
          </h2>
          <p className="text-gray-400 mt-4">
            Start your journey with us by registering an account.
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
          Already have an account? Login
        </button>
      </div>
    </>
  );
};

export default RegisterPage;

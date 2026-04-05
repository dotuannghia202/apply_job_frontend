import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

function RegisterForm() {
  const [errors, setErrors] = React.useState({
    fullName: "",
    email: "",
  });
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-white">
          Full name
        </Label>
        <Input
          id="fullName"
          name="name"
          placeholder="Enter full name ..."
          className={`h-12 transition-all duration-200 focus-visible:ring-green-500/50 ${
            errors.fullName
              ? "bg-white border-red-500 border-2 text-black shadow-[0_0_10px_rgba(239,68,68,0.2)]"
              : "bg-[#283128] border-none text-white"
          }`}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          placeholder="Enter your email ..."
          className={`h-12 transition-all duration-200 focus-visible:ring-green-500/50 ${
            errors.email
              ? "bg-white border-red-500 border-2 text-black shadow-[0_0_10px_rgba(239,68,68,0.2)]"
              : "bg-[#283128] border-none text-white"
          }`}
        />
      </div>
    </form>
  );
}

export default RegisterForm;

import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/admin/DashboardPage";
import LoginPage from "../pages/auth/LoginPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;

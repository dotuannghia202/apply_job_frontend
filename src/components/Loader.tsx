import React from "react";
import { cn } from "@/lib/utils";
import "./css/loader.css";

interface LoaderProps {
  className?: string;
  fullScreen?: boolean;
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({
  className,
  fullScreen = false,
  color = "text-primary",
}) => {
  const loaderIcon = (
    <div className={cn(`spinner-3d ${color}`, className)}>
      <div className="spinner-3d-inner one"></div>
      <div className="spinner-3d-inner two"></div>
      <div className="spinner-3d-inner three"></div>
    </div>
  );

  // Nếu muốn hiển thị full màn hình khóa tương tác
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
        {loaderIcon}
      </div>
    );
  }

  // Nếu chỉ dùng như 1 component nhỏ
  return (
    <div className="flex items-center justify-center p-4">{loaderIcon}</div>
  );
};

export default Loader;

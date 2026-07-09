import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Mail } from "lucide-react";
import { linkGmail } from "@/api/users/user.api";
import { useAuthStore } from "@/store/auth.store";

export const LinkGmailButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const setGmailLinked = useAuthStore((state) => state.setGmailLinked);

  // 1. Cấu hình luồng Google Login
  const login = useGoogleLogin({
    flow: "auth-code", // RẤT QUAN TRỌNG: Bắt buộc dùng 'auth-code' để backend lấy được Refresh Token
    scope: "https://www.googleapis.com/auth/gmail.send", // Xin quyền Gửi Email
    
    // 2. KHI HR BẤM ĐỒNG Ý TRÊN POPUP GOOGLE
    onSuccess: async (codeResponse) => {
      setIsLoading(true);
      try {
        // Gửi cái mã code (Auth Code) này xuống Backend Java
        await linkGmail(codeResponse.code);
        
        // Cập nhật Zustand store
        setGmailLinked(true);
        
        alert("🎉 Liên kết Gmail thành công! Từ giờ hệ thống sẽ dùng email của bạn để gửi Thư mời phỏng vấn.");
      } catch (error: any) {
        const msg = error.response?.data?.message || "Lỗi khi liên kết Gmail";
        console.error(msg);
        alert(`Lỗi khi liên kết Gmail: ${msg}`);
      } finally {
        setIsLoading(false);
      }
    },

    
    // NẾU HR BẤM HỦY
    onError: (errorResponse) => {
      console.error("Lỗi Google Login:", errorResponse);
      alert("Liên kết thất bại hoặc đã bị hủy.");
    },
  });

  return (
    <button
      onClick={() => login()}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
    >
      <Mail className="w-5 h-5" />
      {isLoading ? "Đang xử lý..." : "Liên kết Gmail của bạn"}
    </button>
  );
};
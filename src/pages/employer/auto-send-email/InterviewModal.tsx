import { useState, useRef, useEffect, useId } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Calendar, MapPin, MessageSquare, X, LoaderCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { linkGmail } from "@/api/users/user.api";
import { useUpdateApplicationStatus } from "@/api/applications/application.queries";

interface InterviewModalProps {
  applicationId: number;
  onClose: () => void;
}

export const InterviewModal = ({ applicationId, onClose }: InterviewModalProps) => {
  const user = useAuthStore((state) => state.user);
  const setGmailLinked = useAuthStore((state) => state.setGmailLinked);
  const updateStatusMutation = useUpdateApplicationStatus();
  
  const titleId = useId();
  const timeInputId = useId();
  const locationInputId = useId();
  const messageInputId = useId();

  const [formData, setFormData] = useState({
    time: "",
    location: "",
    message: "Vui lòng chuẩn bị kỹ lưỡng và phản hồi lại email này để xác nhận khả năng tham dự phỏng vấn của bạn. Hẹn gặp lại bạn!",
  });

  const [isLinking, setIsLinking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dùng Ref để tránh lỗi closure biến formData cũ trong callback OAuth
  const latestFormData = useRef(formData);
  useEffect(() => {
    latestFormData.current = formData;
  }, [formData]);

  const isProcessing = isLinking || isSubmitting || updateStatusMutation.isPending;

  // 1. GỬI THÔNG TIN PHỎNG VẤN LÊN BACKEND
  const submitInterviewData = async (dataToSubmit: typeof formData) => {
    setIsSubmitting(true);
    try {
      // Chuyển đổi định dạng ngày giờ sang định dạng ISO 8601 UTC
      const isoTime = new Date(dataToSubmit.time).toISOString();
      
      await updateStatusMutation.mutateAsync({
        id: applicationId,
        data: {
          status: "INTERVIEW",
          interviewTime: isoTime,
          interviewLocation: dataToSubmit.location,
        },
      });

      alert("🎉 Lên lịch phỏng vấn và gửi thư mời thành công!");
      onClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Lỗi khi cập nhật trạng thái phỏng vấn.";
      alert(`Thất bại: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. LUỒNG LIÊN KẾT GOOGLE OAUTH
  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    scope: "https://www.googleapis.com/auth/gmail.send",
    onSuccess: async (codeResponse) => {
      setIsLinking(true);
      try {
        // Gửi authCode lên Backend lưu trữ Refresh Token
        await linkGmail(codeResponse.code);
        
        // Cập nhật Zustand Store
        setGmailLinked(true);
        
        // AUTO RESUME: Tự động chạy tiếp hàm gửi Form với dữ liệu mới nhất
        await submitInterviewData(latestFormData.current);
      } catch (error: any) {
        const msg = error.response?.data?.message || "Lỗi khi liên kết tài khoản Gmail.";
        alert(`Lỗi liên kết Gmail: ${msg}`);
      } finally {
        setIsLinking(false);
      }
    },
    onError: (err) => {
      console.error("Google Auth error:", err);
      alert("Đăng nhập Google thất bại hoặc đã bị hủy.");
      setIsLinking(false);
    }
  });

  // 3. XỬ LÝ KHI CLICK "GỬI THƯ MỜI"
  const handleSendClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.time) {
      alert("Vui lòng chọn thời gian phỏng vấn!");
      return;
    }
    if (!formData.location.trim()) {
      alert("Vui lòng nhập địa điểm phỏng vấn hoặc link Google Meet!");
      return;
    }

    if (user?.isGmailLinked) {
      // Đã liên kết -> Gửi form trực tiếp
      submitInterviewData(formData);
    } else {
      // Chưa liên kết -> Kích hoạt đăng nhập Google để xin quyền JIT
      // Không set isLinking = true ở đây để tránh bị kẹt loading khi popup Google lỗi/đóng
      googleLogin();
    }
  };

  // Đóng modal bằng phím Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isProcessing) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProcessing, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-xs"
      onMouseDown={() => {
        if (!isProcessing) onClose();
      }}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300"
        onMouseDown={(event) => event.stopPropagation()}
        onSubmit={handleSendClick}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="min-w-0">
            <h2 id={titleId} className="text-xl font-bold text-slate-900">
              Lên lịch Phỏng vấn & Gửi Thư mời
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Thông tin sẽ được gửi trực tiếp từ hòm thư Gmail của bạn tới ứng viên.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Đóng"
            className="size-9 shrink-0 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            disabled={isProcessing}
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          
          {/* Cảnh báo nếu chưa liên kết Gmail */}
          {!user?.isGmailLinked ? (
            <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold">Chưa liên kết tài khoản Gmail</p>
                <p className="mt-1 text-xs text-amber-700 leading-relaxed">
                  Để hệ thống gửi email trực tiếp từ hòm thư của bạn, Google sẽ yêu cầu xin quyền gửi email khi bạn nhấn gửi. Dữ liệu đã nhập trên form này vẫn sẽ được giữ nguyên và tự động hoàn thành gửi sau khi bạn liên kết.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold">Gmail đã liên kết thành công</p>
                <p className="mt-1 text-xs text-emerald-700 leading-relaxed">
                  Thư mời phỏng vấn sẽ được gửi ngay lập tức bằng Gmail của bạn tới ứng viên mà không cần xin lại quyền.
                </p>
              </div>
            </div>
          )}

          {/* Ô Nhập Thời gian */}
          <div className="space-y-2">
            <Label htmlFor={timeInputId} className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              <Calendar className="size-4 text-slate-500" />
              Thời gian phỏng vấn <span className="text-red-500">*</span>
            </Label>
            <Input
              id={timeInputId}
              type="datetime-local"
              className="border-slate-200 focus-visible:ring-emerald-500/30"
              required
              disabled={isProcessing}
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>

          {/* Ô Nhập Địa điểm / Google Meet */}
          <div className="space-y-2">
            <Label htmlFor={locationInputId} className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              <MapPin className="size-4 text-slate-500" />
              Địa điểm / Link Google Meet <span className="text-red-500">*</span>
            </Label>
            <Input
              id={locationInputId}
              type="text"
              placeholder="VD: Phòng họp số 1 hoặc link Google Meet"
              className="border-slate-200 focus-visible:ring-emerald-500/30"
              required
              disabled={isProcessing}
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          {/* Lời nhắn */}
          <div className="space-y-2">
            <Label htmlFor={messageInputId} className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              <MessageSquare className="size-4 text-slate-500" />
              Lời nhắn từ Nhà tuyển dụng
            </Label>
            <Textarea
              id={messageInputId}
              rows={4}
              placeholder="Nhập lời dặn dò, hướng dẫn chuẩn bị trước phỏng vấn cho ứng viên..."
              className="resize-none border-slate-200 focus-visible:ring-emerald-500/30"
              disabled={isProcessing}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-white px-6 py-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="rounded-lg"
            disabled={isProcessing}
            onClick={onClose}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            className="rounded-lg bg-emerald-600 font-semibold text-white hover:bg-emerald-700 disabled:opacity-70"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <LoaderCircle className="size-4 animate-spin" />
                {isLinking ? "Đang liên kết Gmail..." : "Đang gửi thư mời..."}
              </span>
            ) : (
              "Lên lịch & Gửi thư mời"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
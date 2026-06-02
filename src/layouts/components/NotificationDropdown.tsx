import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCheck,
  CircleDot,
  Info,
  Briefcase,
  Building,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi"; // Format Tiếng Việt (Tùy chọn)

import { useAuthStore } from "@/store/auth.store";
import {
  useGetNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from "@/api/notifications/notification.queries";
import type { INotification } from "@/types/notification";
import type { RoleName } from "@/types/auth";

dayjs.extend(relativeTime);
dayjs.locale("vi");

type NotificationDropdownProps = {
  onClose?: () => void;
};

const NotificationDropdown = ({ onClose }: NotificationDropdownProps) => {
  const [tab, setTab] = useState<"ALL" | "UNREAD">("ALL");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 1. LẤY THÔNG TIN USER & ROLE HIỆN TẠI TỪ STORE
  const user = useAuthStore((state) => state.user);

  // Xác định Role hiện tại từ store
  let currentRole: RoleName = "CANDIDATE";
  if (user?.roles.includes("ADMIN")) {
    currentRole = "ADMIN";
  } else if (user?.roles.includes("EMPLOYER")) {
    currentRole = "EMPLOYER";
  }

  // 2. GỌI API QUA TANSTACK QUERY
  const { data: notifData, refetch } = useGetNotifications(
    {
      isRead: tab === "UNREAD" ? false : undefined,
      role: currentRole,
      page: 1,
      size: 20,
    },
    { enabled: !!user },
  );

  const notifications: INotification[] = notifData?.data?.result || [];
  // const unreadCount = notifications.filter((n) => !n.read).length;

  const { mutate: markRead } = useMarkAsRead();
  const { mutate: markAllRead } = useMarkAllAsRead();

  // 3. XỬ LÝ WEBSOCKET (REAL-TIME)
  useEffect(() => {
    if (!user) return;

    const stompClient = new Client({
      // Đảm bảo URL trỏ đúng về cổng backend của bạn
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      onConnect: () => {
        console.log("🔗 Đã kết nối WebSocket");

        // Lắng nghe kênh Cá nhân
        stompClient.subscribe(`/topic/user/${user.id}`, (message) => {
          const newNotif = JSON.parse(message.body);

          // Chỉ "Ting ting" nếu thông báo đúng với Role đang mở
          // Hoặc luôn báo nhưng chỉ refetch data nếu đúng Role
          if (
            newNotif.targetRole === currentRole ||
            newNotif.targetRole === `ROLE_${currentRole}`
          ) {
            // Mẹo: Gọi Toast thư viện ở đây (VD: toast.success(newNotif.title))
            alert(`🔔 THÔNG BÁO MỚI: ${newNotif.title}`);
            refetch(); // Tải lại danh sách
          }
        });

        // Lắng nghe kênh Admin (Chỉ khi user là Admin)
        if (user.roles.includes("ADMIN")) {
          stompClient.subscribe(`/topic/admin`, (message) => {
            const newNotif = JSON.parse(message.body);
            if (currentRole === "ADMIN") {
              alert(`🚨 ADMIN ALERT: ${newNotif.title}`);
              refetch();
            }
          });
        }
      },
    });

    stompClient.activate();

    // Cleanup khi component unmount
    return () => {
      stompClient.deactivate();
    };
  }, [user, currentRole, refetch]);

  // 4. HÀM CHUYỂN HƯỚNG DỰA THEO TYPE
  const handleNotifClick = (notif: INotification) => {
    if (!notif.read) markRead(notif.id);
    onClose?.();

    switch (notif.type) {
      case "NEW_COMPANY_REQUEST":
        navigate("/admin/companies");
        break;
      case "COMPANY_APPROVED":
      case "COMPANY_REJECTED":
      case "COMPANY_SUSPENDED":
      case "COMPANY_RESTORED":
        navigate("/employer/company-profile");
        break;
      case "APP_STATUS_UPDATED":
        navigate(
          notif.referenceId
            ? `/applications/${notif.referenceId}`
            : "/applications",
        );
        break;
      default:
        break;
    }
  };

  // Click ra ngoài đóng popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lấy icon theo type
  const getIcon = (type: string) => {
    if (type?.includes("COMPANY")) return <Building className="w-5 h-5" />;
    if (type?.includes("APP_")) return <Briefcase className="w-5 h-5" />;
    return <Info className="w-5 h-5" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="absolute right-0 mt-3 w-[400px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-lg text-slate-800">Thông báo</h3>
          <button
            onClick={() => markAllRead(currentRole)}
            className="text-sm font-medium text-primary hover:text-green-700 transition flex items-center gap-1"
          >
            <CheckCheck className="w-4 h-4" /> Đánh dấu đã đọc
          </button>
        </div>

        {/* TABS */}
        <div className="flex px-4 py-2 bg-white border-b border-slate-100 gap-2">
          <button
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition ${tab === "ALL" ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}
            onClick={() => setTab("ALL")}
          >
            Tất cả
          </button>
          <button
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition ${tab === "UNREAD" ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}
            onClick={() => setTab("UNREAD")}
          >
            Chưa đọc
          </button>
        </div>

        {/* DANH SÁCH THÔNG BÁO */}
        <div className="max-h-[420px] overflow-y-auto custom-scrollbar bg-white">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Bell className="w-12 h-12 mb-3 opacity-20" />
              <p>Bạn chưa có thông báo nào.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotifClick(notif)}
                className={`flex gap-4 p-4 border-b border-slate-50 cursor-pointer transition duration-200 hover:bg-slate-50
                    ${!notif.read ? "bg-green-50/40" : "bg-white"}
                  `}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 
                    ${!notif.read ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500"}
                  `}
                >
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-sm mb-1 ${!notif.read ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}
                  >
                    {notif.title}
                  </h4>
                  <p className="text-sm text-slate-600 line-clamp-2 leading-snug">
                    {notif.message}
                  </p>
                  <p className="text-xs font-medium text-slate-400 mt-2">
                    {dayjs(notif.createdAt).fromNow()}
                  </p>
                </div>

                {/* Chấm bi báo chưa đọc */}
                <div className="w-4 shrink-0 flex justify-center mt-2">
                  {!notif.read && (
                    <CircleDot className="w-3 h-3 text-primary fill-primary" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;

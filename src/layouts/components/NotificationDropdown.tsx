import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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
import "dayjs/locale/vi";

import { useAuthStore } from "@/store/auth.store";
import {
  useGetNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from "@/api/notifications/notification.queries";
import type { INotification } from "@/types/notification";
import type { RoleName } from "@/types/auth";

dayjs.extend(relativeTime);

interface NotificationProps {
  currentRole: RoleName; // Nhận từ AppHeader: "CANDIDATE" | "EMPLOYER" | "ADMIN"
}

const NotificationDropdown = ({ currentRole }: NotificationProps) => {
  const { t, i18n } = useTranslation();
  // Quản lý trạng thái Mở/Đóng của Popup
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"ALL" | "UNREAD">("ALL");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  // GỌI API QUA TANSTACK QUERY
  const { data: notifData, refetch } = useGetNotifications(
    {
      isRead: tab === "UNREAD" ? false : undefined,
      role: currentRole, // Dùng prop truyền từ AppHeader vào
      page: 1,
      size: 20,
    },
    { enabled: !!user },
  );

  const notifications: INotification[] = notifData?.data?.result || [];
  const dayjsLocale = i18n.language === "vi" ? "vi" : "en";

  // Đếm số thông báo chưa đọc để hiện chấm đỏ trên chuông
  const unreadCount = notifications.filter((n) => !n.read).length;

  const { mutate: markRead } = useMarkAsRead();
  const { mutate: markAllRead } = useMarkAllAsRead();

  // XỬ LÝ WEBSOCKET (REAL-TIME)
  useEffect(() => {
    if (!user) return;
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";
    const wsUrl = apiBaseUrl.replace(/\/api\/v1\/?$/, "") + "/ws";

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(wsUrl),

      onConnect: () => {
        console.log("Đã kết nối WebSocket", wsUrl);

        // 1. Lắng nghe kênh Cá nhân (Bỏ if đi để nhận full thông báo)
        stompClient.subscribe(`/topic/user/${user.id}`, () => {
          refetch();

        });

        // 2. Lắng nghe kênh Admin (Chỉ cần user có quyền Admin là được nghe)
        if (user.roles.includes("ADMIN")) {
          stompClient.subscribe(`/topic/admin`, () => {
            refetch();

          });
        }
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [user, refetch, t]);

  // HÀM CHUYỂN HƯỚNG KHI CLICK VÀO 1 THÔNG BÁO
  const handleNotifClick = (notif: INotification) => {
    if (!notif.read) markRead(notif.id);

    // Đóng popup sau khi click
    setIsOpen(false);

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
      case "NEW_APPLICATION":
        navigate(`/employer/applicants`);
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
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    if (type?.includes("COMPANY")) return <Building className="w-5 h-5" />;
    if (type?.includes("APP_")) return <Briefcase className="w-5 h-5" />;
    return <Info className="w-5 h-5" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-slate-600 transition-all hover:bg-slate-100 hover:text-primary"
        aria-label={t("notificationDropdown.open")}
      >
        <Bell className="w-5 h-5" />

        {/* Chấm đỏ chớp nháy báo có tin chưa đọc */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
          </span>
        )}
      </button>

      {/* POPUP PANEL HIỂN THỊ DANH SÁCH */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-100 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col">
          {/* HEADER */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-lg text-slate-800">
              {t("notificationDropdown.title")}
            </h3>
            <button
              onClick={() => markAllRead(currentRole)}
              className="text-sm font-medium text-primary hover:text-green-700 transition flex items-center gap-1"
            >
              <CheckCheck className="w-4 h-4" />{" "}
              {t("notificationDropdown.markAllRead")}
            </button>
          </div>

          {/* TABS */}
          <div className="flex px-4 py-2 bg-white border-b border-slate-100 gap-2">
            <button
              className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition ${tab === "ALL" ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}
              onClick={() => setTab("ALL")}
            >
              {t("notificationDropdown.tabs.all")}
            </button>
            <button
              className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition ${tab === "UNREAD" ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}
              onClick={() => setTab("UNREAD")}
            >
              {t("notificationDropdown.tabs.unread")}
            </button>
          </div>

          {/* DANH SÁCH THÔNG BÁO */}
          <div className="max-h-105 overflow-y-auto custom-scrollbar bg-white">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Bell className="w-12 h-12 mb-3 opacity-20" />
                <p>{t("notificationDropdown.empty")}</p>
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
                    <p className="text-sm text-slate-600 leading-snug">
                      {notif.message}
                    </p>
                    <p className="text-xs font-medium text-slate-400 mt-2">
                      {dayjs(notif.createdAt).locale(dayjsLocale).fromNow()}
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
      )}
    </div>
  );
};

export default NotificationDropdown;

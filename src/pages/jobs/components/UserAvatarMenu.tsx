import { useState } from "react";
import {
  BriefcaseBusiness,
  ChevronDown,
  Eye,
  FileText,
  FileUser,
  Heart,
  LockKeyhole,
  LogOut,
  Send,
  ShieldCheck,
  Sparkles,
  UserCog,
  UserRoundPlus,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import avatarPlaceholder from "@/assets/images/avatar-placeholder.webp";
import { useAuthStore } from "@/store/auth.store";

type AccountMenuItem = {
  label: string;
  icon: LucideIcon;
};

type AccountMenuSection = {
  title: string;
  icon: LucideIcon;
  items: AccountMenuItem[];
};

const accountMenuSections: AccountMenuSection[] = [
  {
    title: "Quản lý tìm việc",
    icon: BriefcaseBusiness,
    items: [
      { label: "Việc làm yêu thích", icon: Heart },
      { label: "Việc làm đã ứng tuyển", icon: Send },
      { label: "Việc làm phù hợp với bạn", icon: Sparkles },
    ],
  },
  {
    title: "Quản lý CV",
    icon: FileText,
    items: [
      { label: "Nhà tuyển dụng xem hồ sơ", icon: Eye },
      { label: "CV của tôi", icon: FileUser },
      {
        label: "Nhà tuyển dụng muốn kết nối với bạn",
        icon: UserRoundPlus,
      },
    ],
  },
  {
    title: "Cá nhân và bảo mật",
    icon: ShieldCheck,
    items: [
      { label: "Cài đặt thông tin cá nhân", icon: UserCog },
      { label: "Đổi mật khẩu", icon: LockKeyhole },
    ],
  },
];

const defaultOpenSections = accountMenuSections.reduce<Record<string, boolean>>(
  (openSections, section) => ({
    ...openSections,
    [section.title]: true,
  }),
  {},
);

function AccountDropdownSection({
  isOpen,
  onToggle,
  section,
}: {
  isOpen: boolean;
  onToggle: () => void;
  section: AccountMenuSection;
}) {
  const SectionIcon = section.icon;

  return (
    <section className="border-b border-slate-100 last:border-b-0">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        <div
          className={`flex size-10 shrink-0 items-center justify-center transition-colors ${
            isOpen ? "text-primary" : "text-slate-500"
          }`}
        >
          <SectionIcon className="size-6" />
        </div>

        <span
          className={`min-w-0 flex-1 text-[15px] font-semibold transition-colors ${
            isOpen ? "text-primary" : "text-slate-800"
          }`}
        >
          {section.title}
        </span>

        <ChevronDown
          className={`size-5 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-primary" : "text-slate-500"
          }`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-1 pb-3 pl-18 pr-5">
            {section.items.map((item) => {
              return (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg px-1 py-1.5 text-left text-[15px] font-semibold text-slate-500 transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

const UserAvatarMenu = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [openSections, setOpenSections] = useState(defaultOpenSections);

  const avatarSrc = user?.avatar?.trim() || avatarPlaceholder;
  const displayName = user?.name || "Người dùng";
  const displayEmail = user?.email || "Chưa có email";

  const handleToggleSection = (sectionTitle: string) => {
    setOpenSections((current) => ({
      ...current,
      [sectionTitle]: !current[sectionTitle],
    }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="group relative">
      <button
        type="button"
        aria-label="User account"
        aria-haspopup="menu"
        className="block size-9 overflow-hidden rounded-full border border-slate-200 transition-all hover:ring-2 hover:ring-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <img
          src={avatarSrc}
          alt={displayName}
          className="size-full object-cover"
          onError={(event) => {
            event.currentTarget.src = avatarPlaceholder;
          }}
        />
      </button>

      <div className="invisible absolute right-0 top-full z-50 translate-y-1 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 ">
        <div
          role="menu"
          className="h-92.5 max-h-[calc(100vh-5.5rem)] w-[min(calc(100vw-2rem),400px)] overflow-y-auto rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-slate-900/15 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex items-center gap-4 border-b border-slate-200 px-5 py-4">
            <img
              src={avatarSrc}
              alt={displayName}
              className="size-16 shrink-0 rounded-full border border-slate-200 object-cover"
              onError={(event) => {
                event.currentTarget.src = avatarPlaceholder;
              }}
            />
            <div className="min-w-0">
              <p className="truncate text-[16px] font-semibold text-slate-800">
                {displayName}
              </p>
              <p className="mt-1 truncate text-sm font-medium text-slate-500">
                {displayEmail}
              </p>
            </div>
          </div>

          <div>
            {accountMenuSections.map((section) => (
              <AccountDropdownSection
                key={section.title}
                section={section}
                isOpen={openSections[section.title]}
                onToggle={() => handleToggleSection(section.title)}
              />
            ))}
          </div>

          <div className="px-5 pb-5 pt-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-100 text-base font-bold text-slate-700 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <LogOut className="size-5" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAvatarMenu;

import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  type LucideIcon,
} from "lucide-react";

type PopupVariant = "confirm" | "success" | "error" | "info" | "warning";
type PopupActionStyle = "primary" | "outline" | "danger";

interface PopupAction {
  label: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  style?: PopupActionStyle;
}

interface PopupProps {
  open: boolean;
  variant?: PopupVariant;
  title: string;
  message?: ReactNode;
  actions?: PopupAction[];

  // Gộp chung hàm đóng Popup
  onClose?: () => void;
  onConfirm?: () => void;

  // Labels
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "primary" | "danger";
  closeOnBackdrop?: boolean;

  // Deprecated Props (giữ lại làm fallback để không hỏng code cũ nếu dự án đang dùng)
  onCancel?: () => void;
  onDismiss?: () => void;
  dismissLabel?: string;
}

const variantStyles: Record<
  PopupVariant,
  { Icon: LucideIcon; iconColor: string; iconBg: string; primaryBtn: string }
> = {
  confirm: {
    Icon: HelpCircle,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    primaryBtn:
      "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-400 text-white",
  },
  success: {
    Icon: CheckCircle2,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    primaryBtn:
      "bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-400 text-white",
  },
  error: {
    Icon: AlertTriangle,
    iconColor: "text-red-600",
    iconBg: "bg-red-50",
    primaryBtn:
      "bg-red-600 hover:bg-red-700 focus-visible:ring-red-400 text-white",
  },
  warning: {
    Icon: AlertTriangle,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    primaryBtn:
      "bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-400 text-white",
  },
  info: {
    Icon: Info,
    iconColor: "text-sky-600",
    iconBg: "bg-sky-50",
    primaryBtn:
      "bg-sky-600 hover:bg-sky-700 focus-visible:ring-sky-400 text-white",
  },
};

const baseButtonCls =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const actionButtonStyles: Record<PopupActionStyle, string> = {
  primary: "",
  outline:
    "border border-slate-200 bg-white text-[#2d3338] hover:bg-slate-50 focus-visible:ring-slate-300",
  danger: "bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-400",
};

export function NotificationPopup({
  open,
  variant = "confirm",
  title,
  message,
  actions,
  onClose,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel,
  confirmVariant = "primary",
  closeOnBackdrop = false,

  // Fallbacks
  onCancel,
  onDismiss,
  dismissLabel,
}: PopupProps) {
  if (!open) return null;

  // 1. Gộp tất cả các callback đóng thành 1 hàm duy nhất
  const handleClose = onClose || onCancel || onDismiss;

  // 2. Tự động tính toán Label cho nút Hủy/Đóng
  const closeText =
    cancelLabel || dismissLabel || (onConfirm ? "Cancel" : "Got it");

  const isDangerConfirm = variant === "confirm" && confirmVariant === "danger";
  const styleConfig = variantStyles[variant];

  const IconComponent = styleConfig.Icon;
  const iconBg = isDangerConfirm ? "bg-red-50" : styleConfig.iconBg;
  const iconColor = isDangerConfirm ? "text-red-600" : styleConfig.iconColor;
  const primaryBtn = isDangerConfirm
    ? actionButtonStyles.danger
    : styleConfig.primaryBtn;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4"
      onClick={() => closeOnBackdrop && handleClose?.()}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBg}`}
          >
            <IconComponent className={`size-6 ${iconColor}`} />
          </div>
          <div className="flex-1 pt-0.5">
            <h3 className="text-base font-bold text-[#2d3338]">{title}</h3>
            {message && (
              <p className="mt-1.5 text-sm text-[#596065]">{message}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          {actions?.length ? (
            /* Trường hợp 1: Danh sách nút tùy biến (Custom Actions) */
            actions.map((action, index) => {
              const style = action.style ?? "primary";
              const btnClass =
                style === "primary" ? primaryBtn : actionButtonStyles[style];

              return (
                <button
                  key={`${index}-${String(action.label)}`}
                  type="button"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={`${baseButtonCls} ${btnClass}`}
                >
                  {action.label}
                </button>
              );
            })
          ) : onConfirm ? (
            /* Trường hợp 2: Popup Xác nhận (Confirm Dialog - có 2 nút) */
            <>
              <button
                type="button"
                onClick={handleClose}
                className={`${baseButtonCls} ${actionButtonStyles.outline}`}
              >
                {closeText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`${baseButtonCls} ${
                  confirmVariant === "danger"
                    ? actionButtonStyles.danger
                    : primaryBtn
                }`}
              >
                {confirmLabel}
              </button>
            </>
          ) : (
            /* Trường hợp 3: Popup Thông báo đơn thuần (Single Button) */
            <button
              type="button"
              onClick={handleClose}
              className={`${baseButtonCls} ${primaryBtn}`}
            >
              {closeText}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

import type { ReactNode } from "react";
import { createPortal } from "react-dom";

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
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  confirmVariant?: "primary" | "danger";
  cancelLabel?: string;
  dismissLabel?: string;
  onDismiss?: () => void;
  closeOnBackdrop?: boolean;
}

const variantConfig: Record<
  PopupVariant,
  { icon: ReactNode; iconBg: string; primaryBtn: string }
> = {
  confirm: {
    icon: (
      <svg
        className="h-6 w-6 text-blue-600"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    iconBg: "bg-blue-50",
    primaryBtn:
      "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-400 text-white",
  },
  success: {
    icon: (
      <svg
        className="h-6 w-6 text-emerald-600"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    iconBg: "bg-emerald-50",
    primaryBtn:
      "bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-400 text-white",
  },
  error: {
    icon: (
      <svg
        className="h-6 w-6 text-red-600"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    iconBg: "bg-red-50",
    primaryBtn:
      "bg-red-600 hover:bg-red-700 focus-visible:ring-red-400 text-white",
  },
  warning: {
    icon: (
      <svg
        className="h-6 w-6 text-amber-600"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    iconBg: "bg-amber-50",
    primaryBtn:
      "bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-400 text-white",
  },
  info: {
    icon: (
      <svg
        className="h-6 w-6 text-sky-600"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
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
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  confirmVariant = "primary",
  cancelLabel = "Cancel",
  dismissLabel = "Got it",
  onDismiss,
  closeOnBackdrop = false,
}: PopupProps) {
  if (!open) return null;

  const baseConfig = variantConfig[variant];
  const config =
    variant === "confirm" && confirmVariant === "danger"
      ? {
          ...baseConfig,
          iconBg: "bg-red-50",
          icon: (
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        }
      : baseConfig;

  const handleBackdrop = () => {
    if (closeOnBackdrop) onDismiss?.();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4"
      onClick={handleBackdrop}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.iconBg}`}
          >
            {config.icon}
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
            actions.map((action, index) => {
              const style = action.style ?? "primary";
              const primaryClass = style === "primary" ? config.primaryBtn : "";

              return (
                <button
                  key={`${index}-${String(action.label)}`}
                  type="button"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={`${baseButtonCls} ${actionButtonStyles[style]} ${primaryClass}`}
                >
                  {action.label}
                </button>
              );
            })
          ) : onConfirm ? (
            <>
              <button
                type="button"
                onClick={onCancel}
                className={`${baseButtonCls} ${actionButtonStyles.outline}`}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`${baseButtonCls} ${
                  confirmVariant === "danger"
                    ? actionButtonStyles.danger
                    : config.primaryBtn
                }`}
              >
                {confirmLabel}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onDismiss}
              className={`${baseButtonCls} ${config.primaryBtn}`}
            >
              {dismissLabel}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

import i18n from "@/i18n";
import { isAxiosError } from "axios";

interface ApiErrorResponse {
  error?: string;
  message?: string | string[];
}

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return i18n.t("apiErrors.NETWORK_ERROR", "Lỗi kết nối mạng, vui lòng kiểm tra lại đường truyền.");
    }

    const data = error.response.data as ApiErrorResponse | undefined;
    const errorCode = data?.error;
    const fallbackMessage = data?.message;

    if (errorCode && i18n.exists(`apiErrors.${errorCode}`)) {
      return i18n.t(`apiErrors.${errorCode}`);
    }

    if (typeof fallbackMessage === "string" && fallbackMessage.trim()) {
      return fallbackMessage;
    }

    if (Array.isArray(fallbackMessage)) {
      return fallbackMessage.join(", ");
    }
  }

  return i18n.t("apiErrors.UNKNOWN_ERROR", "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau!");
}

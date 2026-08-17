import { downloadFile } from "@/api/files/file.api";

export const preventSpaceKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === " ") {
    e.preventDefault();
  }
};

export const toUtcMidnightIso = (dateInput?: string) => {
  const sourceDate = dateInput ? new Date(dateInput) : new Date();
  const year = sourceDate.getFullYear();
  const month = sourceDate.getMonth();
  const day = sourceDate.getDate();
  return new Date(Date.UTC(year, month, day, 0, 0, 0)).toISOString();
};
export const getLocalDatetimeMin = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const formatDate = (value?: string | null, locale: string = "en-GB") => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(locale);
};

interface ValidatePdfResult {
  isValid: boolean;
  errorKey?: "notPdf" | "fileTooLarge";
}

const allowedTypes = ["application/pdf"];

//Validate file
export const validatePdfFile = (
  file: File,
  maxSizeBytes = 5 * 1024 * 1024,
): ValidatePdfResult => {
  // Validate type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      errorKey: "notPdf",
    };
  }

  // Validate size
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      errorKey: "fileTooLarge",
    };
  }

  return { isValid: true };
};

// Helper format dung lượng file
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const openFileInNewTab = (fileUrl: string) =>
  `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=false`;

//   fileUrl: string,
//   fileName?: string,
// ) => {
//   if (!fileUrl) {
//     throw new Error("EMPTY_FILE_URL");
//   }

//   // 1. Gọi API nhận dữ liệu nhị phân (Blob)
//   const res = await downloadFile(fileUrl, fileName);

//   // Xử lý linh hoạt theo cấu trúc Axios interceptor (nếu interceptor trả về thẳng res.data hay full response)
//   const blobData = res instanceof Blob ? res : (res as any)?.data || res;

//   if (!(blobData instanceof Blob)) {
//     throw new Error("INVALID_BLOB_RESPONSE");
//   }

//   // 2. Tạo link ảo từ Blob trong bộ nhớ trình duyệt
//   const blobUrl = window.URL.createObjectURL(blobData);
//   const targetName = fileName || "CV_Resume.pdf";

//   // 3. Tự động click kích hoạt tải xuống
//   const link = document.createElement("a");
//   link.href = blobUrl;
//   link.download = targetName.endsWith(".pdf")
//     ? targetName
//     : `${targetName}.pdf`;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);

//   // 4. Giải phóng bộ nhớ tạm
//   window.URL.revokeObjectURL(blobUrl);
// };

// src/helpers/file.helper.ts

export const handleDownloadFile = async (
  fileUrl: string,
  fileName?: string,
) => {
  if (!fileUrl) {
    throw new Error("EMPTY_FILE_URL");
  }

  // 1. Gọi API nhận dữ liệu file (Blob) từ Backend
  const res = await downloadFile(fileUrl, fileName);
  const blobData = res instanceof Blob ? res : (res as any)?.data || res;

  if (!(blobData instanceof Blob)) {
    throw new Error("INVALID_BLOB_RESPONSE");
  }

  const targetFileName = fileName
    ? fileName.endsWith(".pdf")
      ? fileName
      : `${fileName}.pdf`
    : "CV_Resume.pdf";

  // 1: Dùng File System Access API để BẮT BUỘC hiện cửa sổ chọn thư mục "Save As" (Chrome, Edge, Cốc Cốc, Brave...)
  if ("showSaveFilePicker" in window) {
    try {
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: targetFileName,
        types: [
          {
            description: "Tài liệu PDF",
            accept: { "application/pdf": [".pdf"] },
          },
        ],
      });

      // Ghi dữ liệu file vào vị trí người dùng vừa chọn
      const writableStream = await fileHandle.createWritable();
      await writableStream.write(blobData);
      await writableStream.close();
      return; // Lưu thành công
    } catch (err: unknown) {
      // Nếu người dùng bấm "Cancel" / "Hủy" trên cửa sổ Save As thì dừng lại, không báo lỗi
      if (
        (err instanceof DOMException || err instanceof Error) &&
        err.name === "AbortError"
      ) {
        return; // Người dùng ấn "Cancel" / "Hủy" trên popup Save As
      }
      console.warn("showSaveFilePicker lỗi, chuyển sang tải thông thường", err);
    }
  }

  // 2: Fallback cho các trình duyệt không hỗ trợ showSaveFilePicker (Firefox / Safari)
  const blobUrl = window.URL.createObjectURL(blobData);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = targetFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
};

/**
 * Copy text vào clipboard hỗ trợ cả môi trường HTTPS, localhost lẫn HTTP Production (Fallback document.execCommand)
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!text) return false;

  // 1. Thử dùng Clipboard API (Chỉ hoạt động trên HTTPS hoặc localhost)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("Clipboard API failed, trying fallback execCommand:", err);
    }
  }

  // 2. Fallback dùng document.execCommand('copy') cho HTTP Production / Trình duyệt không hỗ trợ Clipboard API
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Định dạng textarea ẩn không làm nảy giao diện
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    // Xử lý riêng cho iOS Safari
    if (navigator.userAgent.match(/ipad|iphone/i)) {
      const range = document.createRange();
      range.selectNodeContents(textArea);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      textArea.setSelectionRange(0, 999999);
    }

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Fallback copy to clipboard failed:", err);
    return false;
  }
};


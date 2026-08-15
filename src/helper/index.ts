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

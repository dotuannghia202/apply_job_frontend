import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./locales/en/translation.json";
import translationVI from "./locales/vi/translation.json";

const resources = {
  en: { translation: translationEN },
  vi: { translation: translationVI },
};

i18n
  .use(LanguageDetector) // Tự động phát hiện ngôn ngữ trình duyệt
  .use(initReactI18next) // Truyền instance i18n vào react-i18next
  .init({
    resources,
    fallbackLng: "en", // Nếu không tìm thấy ngôn ngữ, mặc định dùng Tiếng Anh
    interpolation: {
      escapeValue: false, // React đã tự động chống XSS rồi nên không cần
    },
  });

export default i18n;

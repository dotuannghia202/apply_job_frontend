import { useTranslation } from "react-i18next";
import VietnamFlag from "@/assets/images/Flag_of_Vietnam.svg.webp";
import UKFlag from "@/assets/images/Flag_of_the_United_Kingdom_3-5.svg.webp";

const LanguageSwitch = () => {
  const { t, i18n } = useTranslation();

  // Xác định ngôn ngữ hiện tại
  const isVi = i18n.language === "vi";

  // Hàm xử lý đổi ngôn ngữ
  const toggleLanguage = () => {
    const newLang = isVi ? "en" : "vi";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="relative flex items-center w-21 h-9 bg-white border border-slate-200 rounded-full shadow-inner overflow-hidden cursor-pointer transition-colors "
      aria-label={t("languageSwitch.toggle")}
    >
      {/* ======================================= */}
      {/* LỚP 1: CHỮ NỀN (Nằm im ở dưới)          */}
      {/* ======================================= */}
      <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
        <span
          className={`text-[13px] font-extrabold text-slate-800 transition-opacity duration-300 ${isVi ? "opacity-100" : "opacity-0"}`}
        >
          VN
        </span>
        <span
          className={`text-[13px] font-extrabold text-slate-800 transition-opacity duration-300 ${!isVi ? "opacity-100" : "opacity-0"}`}
        >
          EN
        </span>
      </div>

      {/* ======================================= */}
      {/* LỚP 2: CỤC TRÒN DI CHUYỂN (Chứa Cờ)       */}
      {/* ======================================= */}
      <div
        className={`relative flex items-center justify-center w-7 h-7 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.2)] transform transition-transform duration-300 ease-in-out
          ${isVi ? "translate-x-12.75" : "translate-x-1"}
        `}
      >
        {/* Cờ Anh (Sẽ hiện khi là Tiếng Anh) */}
        <img
          src={UKFlag}
          alt="EN"
          className={`absolute w-full h-full rounded-full object-cover p-px transition-opacity duration-300 ${!isVi ? "opacity-100" : "opacity-0"}`}
        />

        {/* Cờ Việt Nam (Sẽ hiện khi là Tiếng Việt) */}
        <img
          src={VietnamFlag}
          alt="VN"
          className={`absolute w-full h-full rounded-full object-cover p-px transition-opacity duration-300 ${isVi ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </button>
  );
};

export default LanguageSwitch;

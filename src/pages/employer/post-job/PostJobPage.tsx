import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import {
  PostJobForm,
  type PostJobFormData,
  type PostJobFormErrors,
} from "./components/PostJobForm";
import { PostJobPreview } from "./components/PostJobPreview";
import { useCreateJob } from "@/api/jobs/job.queries";
import { useAuthStore } from "@/store/auth.store";
import { toUtcMidnightIso } from "@/helper";
import { NotificationPopup } from "@/components/NotificationPopup";
import { isAxiosError } from "axios";
import i18n from "@/i18n";

export default function PostJobPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const prefill =
    (location.state as { generatedJob?: Partial<PostJobFormData> } | null)
      ?.generatedJob ?? null;

  const emptyFormData: PostJobFormData = {
    name: "",
    location: "",
    provinceCode: "",
    wardCode: "",
    minSalary: "",
    maxSalary: "",
    quantity: "",
    description: "",
    requirements: [],
    levels: [],
    startDate: "",
    endDate: "",
    active: true,
    benefits: [],
    workingHours: "",
    industryId: "",
    industryName: "",
    specializationId: "",
    specializationName: "",
    skillIds: [],
    skillNames: [],
  };

  const [formData, setFormData] = useState<PostJobFormData>(() => ({
    name: prefill?.name ?? "",
    location: prefill?.location ?? "",
    provinceCode: prefill?.provinceCode ?? "",
    wardCode: prefill?.wardCode ?? "",
    minSalary: prefill?.minSalary ?? "",
    maxSalary: prefill?.maxSalary ?? "",
    quantity: prefill?.quantity ?? "",
    description: prefill?.description ?? "",
    requirements: prefill?.requirements ?? [],
    levels: prefill?.levels ?? [],
    startDate: prefill?.startDate ?? "",
    endDate: prefill?.endDate ?? "",
    active: prefill?.active ?? true,
    benefits: prefill?.benefits ?? [],
    workingHours: prefill?.workingHours ?? "",
    industryId: prefill?.industryId ?? "",
    industryName: prefill?.industryName ?? "",
    specializationId: prefill?.specializationId ?? "",
    specializationName: prefill?.specializationName ?? "",
    skillIds: prefill?.skillIds ?? [],
    skillNames: prefill?.skillNames ?? [],
  }));
  const [errors, setErrors] = useState<PostJobFormErrors>({});
  const [formResetKey, setFormResetKey] = useState(0);
  const [popup, setPopup] = useState<{
    open: boolean;
    variant: "success" | "error";
    title: string;
    message?: string;
    dismissLabel?: string;
  }>({
    open: false,
    variant: "success",
    title: "",
    message: "",
  });
  const companyId = useAuthStore((state) => state.company?.id ?? null);
  const { mutateAsync: createJob } = useCreateJob();

  const validate = (): PostJobFormErrors => {
    const nextErrors: PostJobFormErrors = {};
    const todayIso = new Date(
      Date.now() - new Date().getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 10);

    if (!formData.name.trim()) {
      nextErrors.name = t("employerPostJob.validation.nameRequired");
    }

    if (!formData.provinceCode) {
      nextErrors.provinceCode = t("employerPostJob.validation.provinceRequired");
    }
    if (!formData.wardCode) {
      nextErrors.wardCode = t("employerPostJob.validation.wardRequired");
    }

    if (formData.startDate && formData.startDate < todayIso) {
      nextErrors.startDate = t("employerPostJob.validation.startDatePast");
    }

    if (!formData.description.trim()) {
      nextErrors.description = t(
        "employerPostJob.validation.descriptionRequired",
      );
    }
    if (!formData.requirements.length) {
      nextErrors.requirements = t(
        "employerPostJob.validation.requirementsRequired",
      );
    }
    if (!formData.benefits.length) {
      nextErrors.benefits = t("employerPostJob.validation.benefitsRequired");
    }
    if (!formData.levels.length) {
      nextErrors.levels = t("employerPostJob.validation.levelsRequired");
    }

    if (!formData.endDate.trim()) {
      nextErrors.endDate = t("employerPostJob.validation.endDateRequired");
    } else if (formData.endDate < todayIso) {
      nextErrors.endDate = t("employerPostJob.validation.endDatePast");
    }
    if (!formData.workingHours.trim()) {
      nextErrors.workingHours = t(
        "employerPostJob.validation.workingHoursRequired",
      );
    }
    if (!formData.industryId) {
      nextErrors.industryId = t("employerPostJob.validation.industryRequired");
    }
    if (!formData.specializationId) {
      nextErrors.specializationId = t(
        "employerPostJob.validation.specializationRequired",
      );
    }
    if (!formData.skillIds.length) {
      nextErrors.skillIds = t("employerPostJob.validation.skillsRequired");
    }

    return nextErrors;
  };

  const clearResolvedErrors = (
    nextData: PostJobFormData,
    currentErrors: PostJobFormErrors,
  ): PostJobFormErrors => {
    const nextErrors = { ...currentErrors };
    const todayIso = new Date(
      Date.now() - new Date().getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 10);

    if (nextErrors.name && nextData.name.trim()) {
      delete nextErrors.name;
    }

    if (nextErrors.provinceCode && nextData.provinceCode) {
      delete nextErrors.provinceCode;
    }
    if (nextErrors.wardCode && nextData.wardCode) {
      delete nextErrors.wardCode;
    }

    if (
      nextErrors.startDate &&
      (!nextData.startDate || nextData.startDate >= todayIso)
    ) {
      delete nextErrors.startDate;
    }

    if (nextErrors.endDate) {
      if (!nextData.endDate.trim()) {
        // keep error until a value is provided
      } else if (nextData.endDate >= todayIso) {
        delete nextErrors.endDate;
      }
    }

    if (nextErrors.description && nextData.description.trim()) {
      delete nextErrors.description;
    }
    if (nextErrors.requirements && nextData.requirements.length) {
      delete nextErrors.requirements;
    }
    if (nextErrors.benefits && nextData.benefits.length) {
      delete nextErrors.benefits;
    }
    if (nextErrors.levels && nextData.levels.length) {
      delete nextErrors.levels;
    }
    if (nextErrors.workingHours && nextData.workingHours.trim()) {
      delete nextErrors.workingHours;
    }
    if (nextErrors.industryId && nextData.industryId) {
      delete nextErrors.industryId;
    }
    if (nextErrors.specializationId && nextData.specializationId) {
      delete nextErrors.specializationId;
    }
    if (nextErrors.skillIds && nextData.skillIds.length) {
      delete nextErrors.skillIds;
    }

    return nextErrors;
  };

  const handleFormChange = (nextData: PostJobFormData) => {
    setFormData(nextData);
    setErrors((prev) => clearResolvedErrors(nextData, prev));
  };

  const handleSubmit = async () => {
    if (!companyId) return;

    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    try {
      await createJob({
        name: formData.name.trim(),
        location: formData.location.trim(),
        minSalary: formData.minSalary ? Number(formData.minSalary) : 0,
        maxSalary: formData.maxSalary ? Number(formData.maxSalary) : 0,
        quantity: formData.quantity ? Number(formData.quantity) : 1,
        description: formData.description.trim(),
        requirements: formData.requirements,
        levels: formData.levels,
        startDate: toUtcMidnightIso(formData.startDate),
        endDate: toUtcMidnightIso(formData.endDate),
        active: formData.active,
        benefits: formData.benefits,
        workingHours: formData.workingHours.trim() || undefined,
        companyId,
        specializationId: formData.specializationId
          ? Number(formData.specializationId)
          : undefined,
        skillIds: formData.skillIds,
      });
      setFormData(emptyFormData);
      setFormResetKey((prev) => prev + 1);
      setErrors({});
      setPopup({
        open: true,
        variant: "success",
        title: t("employerPostJob.notifications.createSuccessTitle"),
        message: t("employerPostJob.notifications.createSuccessMessage"),
      });
    } catch (error) {
      if (isAxiosError(error)) {
        console.log("Axios error:", error);
        // 1. Lấy nguyên văn câu lỗi từ Backend
        const backendMessage = error.response?.data?.message || "";

        // 2. Khởi tạo biến message sẽ hiện cho người dùng
        let displayMessage = backendMessage;

        // 3. Nếu Frontend đang ở chế độ Tiếng Anh, ta "dịch tay" câu lỗi phổ biến của Backend
        if (i18n.language === "en") {
          // Bắt theo từ khóa hoặc câu đầy đủ mà Backend hay trả về
          if (backendMessage.includes("chưa được Admin phê duyệt")) {
            displayMessage = "Your company profile has not been approved by Admin yet. Please wait for approval to post a job!";
          } else if (backendMessage.includes("đình chỉ hoạt động")) {
            displayMessage = "Your company profile has been suspended. Please contact the administrator!";
          }
          // (Có thể thêm các if-else khác ở đây nếu Backend ném ra nhiều lỗi khác nhau)
        }

        // 4. Hiển thị Popup
        setPopup({
          open: true,
          variant: "error",
          title: t("employerPostJob.notifications.createErrorTitle"), // Đã có hàm t() dịch tự động
          message: displayMessage,
          dismissLabel: t("common.understood", "Đã hiểu"), // Nên đưa vào file i18n
        });

        return;
      }
      console.error("Failed to create job", error);
      setPopup({
        open: true,
        variant: "error",
        title: t("employerPostJob.notifications.createErrorTitle"),
        message: t("employerPostJob.notifications.createErrorMessage"),
      });
    }
  };

  return (
    <main className="min-h-screen bg-main-background px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <PostJobForm
            value={formData}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            errors={errors}
            resetKey={formResetKey}
          />
          <PostJobPreview value={formData} />
        </div>
      </div>
      <NotificationPopup
        open={popup.open}
        variant={popup.variant}
        title={popup.title}
        message={popup.message}
        dismissLabel={popup.dismissLabel || t("common.understood")}
        onDismiss={() => setPopup((prev) => ({ ...prev, open: false }))}
      />
    </main>
  );
}

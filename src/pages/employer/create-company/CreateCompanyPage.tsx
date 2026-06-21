import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CompanyProfileForm } from "./components/CompanyProfileForm";
import { CompanySelectPanel } from "./components/CompanySelectPanel";
import { uploadCompanyLogo } from "@/api/files/file.api";
import { useCreateCompany } from "@/api/companies/company.queries";
import { NotificationPopup } from "@/components/NotificationPopup";
import { useAuthStore } from "@/store/auth.store";

type PopupState = {
  open: boolean;
  variant: "success" | "error";
  title: string;
  message: string;
  dismissLabel: string;
  onDismiss?: () => void;
};

export default function CreateCompanyPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setCompany = useAuthStore((state) => state.setCompany);
  const createCompanyMutation = useCreateCompany();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [popup, setPopup] = useState<PopupState>({
    open: false,
    variant: "success",
    title: "",
    message: "",
    dismissLabel: "",
  });

  useEffect(() => {
    if (!logoPreviewUrl) return;

    return () => {
      URL.revokeObjectURL(logoPreviewUrl);
    };
  }, [logoPreviewUrl]);

  const handleLogoChange = (file: File) => {
    setLogoFile(file);
    setLogoPreviewUrl(URL.createObjectURL(file));
  };

  const showCreateError = (message: string) => {
    setPopup({
      open: true,
      variant: "error",
      title: t("employerCreateCompany.notifications.errorTitle"),
      message,
      dismissLabel: t("employerCreateCompany.notifications.errorAction"),
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!logoFile) {
      showCreateError(t("employerCreateCompany.validation.logoRequired"));
      return;
    }

    if (!companyName.trim()) {
      showCreateError(t("employerCreateCompany.validation.nameRequired"));
      return;
    }

    if (!address.trim()) {
      showCreateError(t("employerCreateCompany.validation.addressRequired"));
      return;
    }

    setIsSubmitting(true);

    try {
      const uploadResponse = await uploadCompanyLogo(logoFile);
      const uploadedFile = uploadResponse.data;
      const logoUrl = uploadedFile?.filePath ?? uploadedFile?.fileName ?? "";

      if (!logoUrl) {
        throw new Error("Upload logo failed");
      }

      const response = await createCompanyMutation.mutateAsync({
        name: companyName.trim(),
        description: description.trim(),
        address: address.trim(),
        logo: logoUrl,
      });

      if (response.data) {
        setCompany({ id: response.data.id, name: response.data.name });
      }

      setPopup({
        open: true,
        variant: "success",
        title: t("employerCreateCompany.notifications.successTitle"),
        message: t("employerCreateCompany.notifications.successMessage"),
        dismissLabel: t("employerCreateCompany.notifications.successAction"),
        onDismiss: () => navigate("/employer/dashboard", { replace: true }),
      });
    } catch (error) {
      console.error("Failed to create company", error);
      showCreateError(t("employerCreateCompany.validation.createFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-main-background px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#2d3338] mb-4 leading-tight">
            {t("employerCreateCompany.page.titlePrefix")}{" "}
            <span className="text-primary">
              {t("employerCreateCompany.page.titleHighlight")}
            </span>
          </h1>
          <p className="text-lg text-[#596065] max-w-2xl leading-relaxed">
            {t("employerCreateCompany.page.description")}
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
        >
          <CompanyProfileForm
            companyName={companyName}
            address={address}
            description={description}
            logoPreviewUrl={logoPreviewUrl}
            isSubmitting={isSubmitting}
            onCompanyNameChange={setCompanyName}
            onAddressChange={setAddress}
            onDescriptionChange={setDescription}
            onLogoChange={handleLogoChange}
          />
          <CompanySelectPanel />
        </form>
      </div>
      <NotificationPopup
        open={popup.open}
        variant={popup.variant}
        title={popup.title}
        message={popup.message}
        dismissLabel={popup.dismissLabel}
        onDismiss={() => {
          setPopup((current) => ({ ...current, open: false }));
          popup.onDismiss?.();
        }}
      />
    </main>
  );
}

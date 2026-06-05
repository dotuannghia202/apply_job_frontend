import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CompanyProfileForm } from "./components/CompanyProfileForm";
import { CompanySelectPanel } from "./components/CompanySelectPanel";
import { uploadCompanyLogo } from "@/api/files/file.api";
import { useCreateCompany } from "@/api/companies/company.queries";
import { useAuthStore } from "@/store/auth.store";

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!logoFile) {
      window.alert(t("employerCreateCompany.validation.logoRequired"));
      return;
    }

    if (!companyName.trim()) {
      window.alert(t("employerCreateCompany.validation.nameRequired"));
      return;
    }

    if (!address.trim()) {
      window.alert(t("employerCreateCompany.validation.addressRequired"));
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

      navigate("/employer/dashboard", { replace: true });
    } catch (error) {
      console.error("Failed to create company", error);
      window.alert(t("employerCreateCompany.validation.createFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-6 py-12">
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
    </main>
  );
}

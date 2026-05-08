import type { BackendResponse } from "@/types/common";
import type { ResUploadFileDTO } from "@/types/file";
import axiosClient from "../axiosClient";

export const uploadCompanyLogo = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("folder", "logo");

  return axiosClient.post("/files", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }) as Promise<BackendResponse<ResUploadFileDTO>>;
};

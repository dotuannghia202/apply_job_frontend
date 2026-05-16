import type { BackendResponse } from "@/types/common";
import type { ResUploadFileDTO } from "@/types/file";
import axiosClient from "../axiosClient";

const uploadFile = async (file: File, folder: string) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("folder", folder);

  return axiosClient.post("/files", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }) as Promise<BackendResponse<ResUploadFileDTO>>;
};

export const uploadCompanyLogo = async (file: File) => {
  return uploadFile(file, "logo");
};

export const uploadResumeFile = async (file: File) => {
  return uploadFile(file, "cv");
};

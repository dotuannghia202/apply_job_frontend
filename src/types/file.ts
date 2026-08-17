export interface ResUploadFileDTO {
  filePath: string;
  uploadedAt?: string;
  fileName?: string;
}

export interface ResDownloadFileDTO {
  downloadUrl: string;
  fileName: string;
}

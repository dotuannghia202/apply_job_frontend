export type CvItem = {
  id: string;
  fileName: string;
  fileUrl?: string | null;
  updatedAt: string;
  skills: string[];
  isDefault?: boolean;
};

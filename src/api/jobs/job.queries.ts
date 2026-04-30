import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJobs, fetchJobById, createJob, deleteJob } from "./job.api";
import { jobKeys } from "./job.keys";
import type { JobListFilters } from "@/types/job";

// 1. Hook GET ALL (Dùng useQuery vì lấy dữ liệu)
export const useGetJobs = (filters: JobListFilters = {}) => {
  const normalizedFilters: Required<Pick<JobListFilters, "page" | "pageSize">> &
    JobListFilters = {
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? 10,
    ...filters,
  };

  return useQuery({
    queryKey: jobKeys.list(normalizedFilters), // Tự động cache lại dựa theo url params (trang, bộ lọc)
    queryFn: () => fetchJobs(normalizedFilters),
    staleTime: 5 * 60 * 1000, // Dữ liệu sẽ sống trong Cache 5 phút trước khi gọi lại API
  });
};

// 2. Hook GET CHI TIẾT
export const useGetJobById = (id: number) => {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: () => fetchJobById(id),
    enabled: !!id, // Chỉ gọi API khi ID hợp lệ (tránh lỗi /jobs/undefined)
  });
};

// 3. Hook CREATE (Dùng useMutation vì làm thay đổi CSDL)
export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      // ĐÂY LÀ SỰ KỲ DIỆU CỦA TANSTACK:
      // Ngay sau khi HR đăng tin thành công, ta báo cho TanStack biết "Dữ liệu danh sách việc làm đã cũ rồi!".
      // TanStack sẽ tự động gọi lại API `useGetJobs` ở dưới background để cập nhật giao diện ngay lập tức!
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
};

// 4. Hook DELETE (Dùng useMutation vì làm thay đổi CSDL)
export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) });
    },
  });
};

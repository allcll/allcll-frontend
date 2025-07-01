import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnAPI } from '@/utils/api.ts';

export interface Department {
  departmentId: number;
  departmentName: string;
}

interface DepartmentsResponse {
  departments: Department[];
}

function useSoyungDepartments() {
  return useQuery({
    queryKey: ['soyungDepartments'],
    queryFn: async () => await fetchJsonOnAPI<DepartmentsResponse>('/api/major'),
    staleTime: Infinity,
    select: (data: DepartmentsResponse) => data.departments,
  });
}

export default useSoyungDepartments;

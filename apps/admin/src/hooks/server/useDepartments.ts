import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnAPI } from '@/utils/api.ts';

export interface Department {
  departmentName: string;
  departmentCode: string;
}

interface DepartmentsAPIResponse {
  departments: Department[];
}

function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
    staleTime: Infinity,
    select: (data: DepartmentsAPIResponse) => {
      // departments.sort((a, b) => a.departmentName.localeCompare(b.departmentName));
      return data.departments;
    },
    enabled: false, // 자동 요청을 비활성화
  });
}

const fetchDepartments = async () => {
  return await fetchJsonOnAPI<DepartmentsAPIResponse>('/api/departments');
};

export default useDepartments;

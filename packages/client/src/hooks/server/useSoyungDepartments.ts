import {useQuery} from '@tanstack/react-query';

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
    queryFn: async () :Promise<DepartmentsResponse> => {
      const response = await fetch('/api/major');
      return response.json();
    },
    staleTime: Infinity,
    select: (data: DepartmentsResponse) => data.departments
  })
}

export default useSoyungDepartments;
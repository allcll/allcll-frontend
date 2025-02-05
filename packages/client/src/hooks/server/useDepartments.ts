import {useQuery} from '@tanstack/react-query';

interface Department {
  departmentName: string
  departmentCode: string
}

interface DepartmentsAPIResponse {
  departments: Department[]
}

function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
    staleTime: Infinity,
    select: (data: DepartmentsAPIResponse) => data.departments,
  });
}

const fetchDepartments = async (): Promise<DepartmentsAPIResponse> => {
  const response = await fetch('/api/departments', {
    headers: {
      'Cookie': `sessionId=${document.cookie.split('=')[1]}`,
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export default useDepartments;
import {useQuery} from '@tanstack/react-query';
import {WishRegister} from '@/utils/types..ts';

interface DetailRegistersResponse {
  eachDepartmentRegisters: WishRegister[];
}

function useDetailRegisters(id: string) {
  return useQuery({
    queryKey: ['detail-registers', id],
    queryFn: () => fetchDetailRegisters(id),
    staleTime: Infinity,
    select: (data) => data.eachDepartmentRegisters,
  });
}

const fetchDetailRegisters = async (subjectId: string): Promise<DetailRegistersResponse> => {
  const response = await fetch(`/api/baskets/${subjectId}`, {
    headers: {
      'Cookie': `sessionId=${document.cookie.split('=')[1]}`,
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

interface DoughnutData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor?: string[];
  }[];
}

// 학과별 관심도 (도넛 차트)
const DefaultDoughnutData: DoughnutData = {
  labels: ["컴퓨터공학과", "정보통신공학과", "소프트웨어학과", "기타"],
  datasets: [
    {
      data: [40, 25, 20, 15],
    },
  ],
};

export function getDoughnutData(data?: WishRegister[]): DoughnutData {
  if (!data)
    return DefaultDoughnutData;

  return {
    labels: data.map((department) => department.registerDepartment),
    datasets: [
      {
        data: data.map((department) => department.eachCount),
        backgroundColor: ["#3B82F6", "#FACC15", "#22C55E", "#EF4444"],
      },
    ],
  };
}

export default useDetailRegisters;
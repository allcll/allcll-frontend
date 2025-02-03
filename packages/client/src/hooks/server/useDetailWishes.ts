import useWishes from '@/hooks/server/useWishes.ts';
import {Wishes} from '@/utils/types..ts';

interface DetailWishes {
  isPending: boolean;
  data?: Wishes;
}

function useDetailWishes(id: string) : DetailWishes {
  const {data} = useWishes();

  if (!data)
    return {
      isPending: true,
    }

  const detail = data?.find((basket) => basket.subjectId === Number(id));

  if (!detail)
    throw new Error('Invalid ID');

  return {
    isPending: false,
    data: detail,
  }
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

export function getDoughnutData(data?: Wishes) {
  if (!data)
    return DefaultDoughnutData;

  return {
    labels: data.DepartmentRegisters.map((department) => department.registerDepartment),
    datasets: [
      {
        data: data.DepartmentRegisters.map((department) => department.eachCount),
        backgroundColor: ["#3B82F6", "#FACC15", "#22C55E", "#EF4444"],
      },
    ],
  };
}

export default useDetailWishes;
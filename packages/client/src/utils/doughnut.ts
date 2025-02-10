import {WishRegister} from '@/utils/types.ts';
import {searchFromCollege, searchFromUniversity} from '@/hooks/server/useDepartments.ts';

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

export const DoughnutColors = ["#F97316", "#3B82F6", "#FACC15", "#22C55E", "#60B6D4"];
// ["#3B82F6", "#FACC15", "#22C55E", "#EF4444"]

export function getDoughnutData(data?: WishRegister[]): DoughnutData {
  if (!data)
    return DefaultDoughnutData;

  const dict: Record<string, number> = {};
  data.forEach((department) => {
    if (!dict[department.registerDepartment ?? ''])
      dict[department.registerDepartment ?? ''] = 0;
    dict[department.registerDepartment ?? ''] += Number(department.eachCount);
  });

  return {
    labels: data.map((department) => department.registerDepartment ?? ''),
    datasets: [
      {
        data: data.map((department) => Number(department.eachCount)),
        backgroundColor: DoughnutColors,
      },
    ],
  };
}

export function getMajorDoughnutData(majorName: string, data?: WishRegister[]): DoughnutData {
  if (!data)
    return DefaultDoughnutData;

  const dict: Record<string, number> = {
    'major': 0,
    'non-major': 0,
  };

  const majors = majorName.split(' ').map((major) => major.trim());
  const isMajor = (names: string) => {
    const name = names.split(' ').map((name) => name.trim());

    return name.some((n) => majors.includes(n));
  }

  data.forEach((department) => {
    const dictName = isMajor(department.registerDepartment ?? '') ? 'major' : 'non-major';
    dict[dictName] += Number(department.eachCount);
  });

  const names = {
    'major': '전공',
    'non-major': '비전공',
  }

  return {
    labels: Object.keys(dict).map((major) => names[major as 'major' | 'non-major']),
    datasets: [
      {
        data: Object.values(dict),
        backgroundColor: DoughnutColors,
      },
    ],
  };
}

export function getUniversityDoughnutData(data?: WishRegister[], UniversityDict?: Record<string, string[]>): DoughnutData {
  if (!data || !UniversityDict)
    return DefaultDoughnutData;

  const dict: Record<string, number> = {};

  data.forEach((department) => {
    const university = searchFromUniversity(department.registerDepartment ?? '', UniversityDict);

    if (!dict[university])
      dict[university] = 0;
    dict[university] += Number(department.eachCount);
  });

  return {
    labels: Object.keys(dict).map((university) => university ? university : "기타"),
    datasets: [
      {
        data: Object.values(dict),
        backgroundColor: DoughnutColors,
      },
    ],
  };
}

export function getCollegeDoughnutData(data?: WishRegister[], collegeDict?: Record<string, string[]>): DoughnutData {
  if (!data || !collegeDict)
    return DefaultDoughnutData;

  const dict: Record<string, number> = {};

  data.forEach((department) => {
    const college = searchFromCollege(department.registerDepartment ?? '', collegeDict);

    if (!dict[college])
      dict[college] = 0;
    dict[college] += Number(department.eachCount);
  });

  return {
    labels: Object.keys(dict).map((college) => college ? college : "기타"),
    datasets: [
      {
        data: Object.values(dict),
        backgroundColor: DoughnutColors,
      },
    ],
  };
}

export function getDoughnutTotalCount(data?: WishRegister[]): number {
  if (!data)
    return -1;

  return data.reduce((acc, cur) => acc + Number(cur.eachCount), 0);
}
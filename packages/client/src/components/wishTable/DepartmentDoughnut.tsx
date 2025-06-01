import { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js/auto';
import useDepartments, { DepartmentDict, useDepartmentDict } from '@/hooks/server/useDepartments.ts';
import {
  getCollegeDoughnutData,
  getDoughnutData,
  getDoughnutTotalCount,
  getMajorDoughnutData,
  getUniversityDoughnutData,
} from '@/utils/doughnut';
import { WishRegister } from '@/utils/types.ts';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export enum DoughnutSelectType {
  MAJOR = '전공/비전공',
  UNIVERSITY = '대학',
  DEPARTMENT = '학과',
  COLLEGE = '학부',
}

function DepartmentDoughnut({ data, majorName }: { data?: WishRegister[]; majorName: string }) {
  const [selectedFilter, setSelectedFilter] = useState<DoughnutSelectType>(DoughnutSelectType.MAJOR);
  const { data: departmentData } = useDepartments();
  const departmentDict = useDepartmentDict(departmentData);
  const { doughnutData, totalCount } = useDoughnutData(data, departmentDict, majorName, selectedFilter);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">관심과목 현황</h2>
        <label className="hidden" htmlFor="doughnut-select">
          필터
        </label>
        <select
          className="border px-3 py-1 rounded-md"
          id="doughnut-select"
          value={selectedFilter}
          onChange={e => setSelectedFilter(e.target.value as DoughnutSelectType)}
        >
          {Object.values(DoughnutSelectType).map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      {!totalCount ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-center text-gray-500 font-semibold">관심과목을 담은 사람이 없습니다.</p>
        </div>
      ) : (
        <Doughnut data={doughnutData} />
      )}
    </div>
  );
}

function useDoughnutData(
  data: WishRegister[] | undefined,
  departmentDict: DepartmentDict,
  majorName: string,
  selectedFilter: DoughnutSelectType,
) {
  let doughnutData;
  const { universityDict, collegeDict } = departmentDict;

  switch (selectedFilter) {
    case DoughnutSelectType.MAJOR:
      doughnutData = getMajorDoughnutData(majorName, data);
      break;
    case DoughnutSelectType.UNIVERSITY:
      doughnutData = getUniversityDoughnutData(data, universityDict);
      break;
    case DoughnutSelectType.DEPARTMENT:
      doughnutData = getCollegeDoughnutData(data, collegeDict);
      break;
    case DoughnutSelectType.COLLEGE:
      doughnutData = getDoughnutData(data);
      break;
    default:
      doughnutData = getDoughnutData(data);
      break;
  }

  const totalCount = getDoughnutTotalCount(data);

  return { doughnutData, totalCount };
}

export default DepartmentDoughnut;

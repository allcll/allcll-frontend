import { useState } from 'react';
import {
  getCollegeDoughnutData,
  getDoughnutData,
  getDoughnutTotalCount,
  getMajorDoughnutData,
  getUniversityDoughnutData,
} from '@/features/wish/lib/doughnut';
import type { IWishesInfo, WishRegister } from '@/shared/model/types';
import useDepartments, { type DepartmentDict, useDepartmentDict } from '@/entities/departments/api/useDepartments';
import useDetailWishes from '@/entities/subjectAggregate/model/useDetailWishes';
import useDetailRegisters from '@/entities/wishes/model/useDetailRegisters';
import { InitWishes } from '@/entities/wishes/model/useWishes';
import LoadingWithMessage from '@/shared/ui/Loading';
import { Flex, Heading, Label } from '@allcll/allcll-ui';
import { DoughnutChart } from '@allcll/charts';

interface IDepartmentDoughnutProps {
  wishesInfo: IWishesInfo;
}

const DOUGHNUT_SELECT_TYPES = {
  MAJOR: '전공/비전공',
  UNIVERSITY: '대학',
  DEPARTMENT: '학과',
  COLLEGE: '학부',
} as const;

type DoughnutSelectType = (typeof DOUGHNUT_SELECT_TYPES)[keyof typeof DOUGHNUT_SELECT_TYPES];

function DepartmentDoughnut({ wishesInfo }: IDepartmentDoughnutProps) {
  const { data: wishes, isPending } = useDetailWishes(wishesInfo);
  const { data: registers } = useDetailRegisters(wishesInfo);

  const data = registers?.eachDepartmentRegisters ?? [];
  const nonNullWishes = wishes ?? InitWishes;
  const majorName = nonNullWishes.departmentName ?? nonNullWishes.manageDeptNm;

  const [selectedFilter, setSelectedFilter] = useState<DoughnutSelectType>(DOUGHNUT_SELECT_TYPES.MAJOR);
  const { data: departmentData } = useDepartments();
  const departmentDict = useDepartmentDict(departmentData);
  const { doughnutData, totalCount } = useDoughnutData(data, departmentDict, majorName, selectedFilter);

  return (
    <>
      <Flex justify="justify-between" align="items-center">
        <Heading level={2}>관심과목 현황</Heading>
        <Label className="hidden" htmlFor="doughnut-select">
          필터
        </Label>
        <select
          className="border px-3 py-1 rounded-md"
          id="doughnut-select"
          value={selectedFilter}
          onChange={e => setSelectedFilter(e.target.value as DoughnutSelectType)}
        >
          {Object.values(DOUGHNUT_SELECT_TYPES).map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </Flex>

      {isPending ? (
        <Flex justify="justify-center" align="items-center" className="h-48">
          <LoadingWithMessage message="관심과목 현황을 불러오는 중입니다..." />
        </Flex>
      ) : !totalCount ? (
        <Flex justify="justify-center" align="items-center" className="h-48">
          <p className="text-center text-gray-500 font-semibold">관심과목을 담은 사람이 없습니다.</p>
        </Flex>
      ) : (
        <DoughnutChart data={doughnutData} className="mt-4" />
      )}
    </>
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
    case DOUGHNUT_SELECT_TYPES.MAJOR:
      doughnutData = getMajorDoughnutData(majorName, data);
      break;
    case DOUGHNUT_SELECT_TYPES.UNIVERSITY:
      doughnutData = getUniversityDoughnutData(data, universityDict);
      break;
    case DOUGHNUT_SELECT_TYPES.DEPARTMENT:
      doughnutData = getCollegeDoughnutData(data, collegeDict);
      break;
    case DOUGHNUT_SELECT_TYPES.COLLEGE:
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

import React from 'react';
import useWishes from "@/hooks/server/useWishes.ts";
import {SSEType, useSseData} from "@/hooks/useSSEManager.ts";
import useTick from "@/hooks/useTick.ts";
import {Department} from '@/hooks/server/useSoyungDepartments.ts';
import CardWrap from "@/components/CardWrap.tsx";
import {SkeletonRow} from "@/components/skeletons/SkeletonTable.tsx";
import NetworkError from "@/components/dashboard/errors/NetworkError.tsx";
import ZeroListError from "@/components/dashboard/errors/ZeroListError.tsx";
import useSSECondition from '@/store/useSSECondition.ts';
import {getSeatColor} from '@/utils/colors.ts';

interface IRealtimeTable {
  title: string;
  showSelect?: boolean;
}

const TableHeadTitles = [
  {title: "과목코드", key: "code"},
  {title: "과목명", key: "name"},
  {title: "담당교수", key: "professor"},
  {title: "여석", key: "seat"},
  {title: "최근갱신", key: "queryTime"},
];

interface ITableData {
  code?: string;
  name?: string;
  professor?: string | null;
  seat?: number;
  queryTime?: string;
}

const RealtimeTable = ({title="교양과목", showSelect=false}: IRealtimeTable) => {
  // major list API fetch
  // subject list SSE API fetch
  // const {data: departments} = useSoyungDepartments();
  const departments: Department[] = [];
  const sseType = title === "교양과목" ? SSEType.NON_MAJOR : SSEType.MAJOR;
  const isError = useSSECondition((state) => state.isError);
  const setForceReload = useSSECondition((state) => state.setForceReload);
  const {data: subjectIds} = useSseData(sseType);
  const {data: subjectData} = useWishes();

  const tableData: ITableData[] = subjectIds?.map((subject) => {
    const {subjectId, seatCount, queryTime} = subject;
    const {subjectName, subjectCode, classCode, professorName} = subjectData?.find((subject) => subject.subjectId === subjectId) || {};
    return {code: `${subjectCode}-${classCode}`, name: subjectName, professor: professorName, seat: seatCount, queryTime};
  }) ?? [];

  const setMajor = (departmentId: number) => {
    fetch("/api/set-major", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({departmentId}),
    }).then();
  }

  const onChangeDepartment = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const departmentId = e.target.value;
    if (departmentId) {
      setMajor(Number(departmentId));
    }
  }

  return (
    <CardWrap>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg p-2">{title} 실시간</h2>
        {showSelect && (
          <select className="border border-gray-300 rounded px-4 py-2"
                  onChange={onChangeDepartment}>
            {departments && departments.map((department) => (
              <option key={department.departmentId}>{department.departmentName}</option>
            ))}
          </select>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg text-sm">
          <thead>
          <tr className="bg-gray-50 sticky top-0 z-10 text-nowrap">
            {TableHeadTitles.map(({title}) => (
              <th key={title} className="px-4 py-2">{title}</th>
            ))}
          </tr>
          </thead>
          <tbody>
          {isError ? (
            <tr>
              <td colSpan={TableHeadTitles.length}>
                <NetworkError onReload={setForceReload}/>
              </td>
            </tr>
          ) : !tableData ? (
            Array.from({length: 5}).map((_, i) => (
              <SkeletonRow key={i} length={TableHeadTitles.length}/>
            ))
          ) : !tableData.length ? (
            <tr>
              <td colSpan={TableHeadTitles.length} className="text-center">
                <ZeroListError/>
              </td>
            </tr>
          ) : (
            tableData.map((subject, index) => (
              <SubjectRow key={index} subject={subject}/>
            )))}
          </tbody>
        </table>
      </div>
    </CardWrap>
  );
};

function SubjectRow({subject}: {subject: ITableData}) {
  return (
    <tr className="border-t border-gray-200 text-black">
      {TableHeadTitles.map(({key}) =>
        key == "seat" ? (
        <td key={key} className="px-4 py-2 text-center">
          <span className={"px-3 py-1 rounded-full text-xs font-bold " + getSeatColor(subject.seat ?? -1)}>
            {subject[key]}
          </span>
        </td>
      ) : key == "queryTime" ? (
        <QueryTimeTd key={key} queryTime={subject.queryTime} />
      ) : (
          <td key={key} className="px-4 py-2 text-center">{subject[key as keyof ITableData]}</td>
        )
      )}
    </tr>
  );
}

function QueryTimeTd({queryTime}: {queryTime?: string}) {
  useTick();

  return (
    <td className="px-4 py-2 text-center text-xs">
      <span className="px-3 py-1 rounded-full text-gray-500">
        {getTimeDiffString(queryTime)}
      </span>
    </td>
  );
}

// Todo: 초당 갱신되는 컴포넌트 만들기
export function getTimeDiffString(time?: string) {
  if (!time)
    return "검색 중";

  const now = new Date();
  const date = new Date(time);
  const diff = now.getTime() - date.getTime();

  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);
  const month = Math.floor(day / 30);
  const year = Math.floor(month / 12);

  if (year > 0)
    return `${year}년 전`;
  if (month > 0)
    return `${month}개월 전`;
  if (day > 0)
    return `${day}일 전`;
  if (hour > 0)
    return `${hour}시간 전`;
  if (min > 0)
    return `${min}분 전`;
  if (sec > 0)
    return `${sec}초 전`;

  return "방금 전";
}

export default RealtimeTable;

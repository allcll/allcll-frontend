import React from 'react';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import NothingTable from './table/NothingTable';
import SubjectsTable from './table/SubjectsTable';

interface SubjectsSectionProps {
  title: string;
  isRegisteredTable: boolean;
  children?: React.ReactNode;
}

const SUBJECTS_COLUMNS_HEADER = [
  '순번',
  '신청',
  '학수번호',
  '분반',
  '개설학과',
  '교과목명',
  '수업계획서',
  '강의언어',
  '학점/이론/실습',
  '이수',
  '학년',
  '시간표',
  '인원보기',
  // 수강대상 및 유의사항
  // 사이버강좌
];

// 학년 대신 재수강
const SUBJECTS_COLUMNS_HEADER_REGISTERED = ['순번', '삭제', ...SUBJECTS_COLUMNS_HEADER.slice(2)];

function SimulationSubjectsHeader({ isRegisteredTable }: { isRegisteredTable: boolean }) {
  const HEADER = isRegisteredTable ? SUBJECTS_COLUMNS_HEADER_REGISTERED : SUBJECTS_COLUMNS_HEADER;
  return (
    <thead className="bg-gray-100">
      <tr className="text-nowrap">
        {HEADER.map(column => (
          <th key={column} className="border border-gray-300 px-2 py-1">
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default function SubjectsSection({ title, isRegisteredTable, children }: SubjectsSectionProps) {
  const simulationStatus = useSimulationProcessStore(state => state.currentSimulation.simulationStatus);
  const currentModal = useSimulationModalStore(state => state.type);

  return (
    <section className="mt-4 ">
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-start gap-2 mb-2">
        <div className="flex flex-col sm:flex-row items-baseline gap-2">
          <span className="font-semibold pl-2 border-l-4 border-blue-500">{title}</span>
        </div>
        {children}
      </div>
      <div className="overflow-x-auto min-h-[300px] border-gray-300">
        <table className="w-full border border-gray-300 border-t-3 text-xs border-t-black text-center">
          <SimulationSubjectsHeader isRegisteredTable={isRegisteredTable} />

          {simulationStatus === 'progress' && currentModal !== 'waiting' ? (
            <SubjectsTable isRegisteredTable={isRegisteredTable} />
          ) : (
            <NothingTable />
          )}
        </table>
      </div>
    </section>
  );
}

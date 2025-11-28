import SejongUI from '@allcll/sejong-ui';
import { type ColumnDefinition } from '@allcll/sejong-ui';
import { SimulationSubject } from '@/utils/types';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess.ts';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal.ts';
import { getDynamicColumns } from '@/components/simulation/table/NoneRegisteredTable.tsx';

const columns: ColumnDefinition<SimulationSubject>[] = [
  {
    header: '순번',
    accessorKey: 'subjectId', // accessorKey는 필수지만 cell 함수에서 덮어쓰므로 아무거나 넣어도 무방
    cell: (_, index) => index + 1,
  },
  {
    header: '삭제',
    accessorKey: 'subjectId',
    cell: () => <SejongUI.Button size="sm">삭제</SejongUI.Button>,
  },
  {
    header: '학수번호',
    accessorKey: 'subjectCode',
  },
  {
    header: '분반',
    accessorKey: 'classCode',
  },
  {
    header: '개설학과',
    accessorKey: 'departmentName',
    cell: subject => <div className="text-left">{subject.departmentName}</div>,
  },
  {
    header: '교과목명',
    accessorKey: 'subjectName',
    cell: subject => <div className="text-left">{subject.subjectName}</div>,
  },
  {
    header: '수업계획서',
    accessorKey: 'subjectId',
    cell: () => (
      <SejongUI.Button size="sm" variant="dark">
        수업계획서
      </SejongUI.Button>
    ),
  },
  {
    header: '강의언어',
    accessorKey: 'language',
  },
  {
    header: '학점/이론/실습',
    accessorKey: 'tm_num',
  },
  {
    header: '이수',
    accessorKey: 'subjectType',
  },
  {
    header: '재수강',
    accessorKey: 'semester_at',
    cell: () => '-',
  },
  {
    header: '시간표',
    accessorKey: 'lesn_time',
  },
  {
    header: '인원보기',
    accessorKey: 'subjectId',
    cell: () => (
      <SejongUI.Button size="sm" variant="dark">
        수강인원
      </SejongUI.Button>
    ),
  },
];

const RegisteredTable = () => {
  const currentSimulation = useSimulationProcessStore(state => state.currentSimulation);
  const currentModal = useSimulationModalStore(state => state.type);

  const displayColumns = getDynamicColumns(columns);
  const subjects =
    currentSimulation.simulationStatus === 'progress' && currentModal !== 'waiting'
      ? currentSimulation.registeredSubjects
      : [];

  return <SejongUI.DataTable columns={displayColumns} data={subjects} keyInfo="subjectId" />;
};

export default RegisteredTable;

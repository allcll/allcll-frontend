import SejongUI from '../../../../../sejong-ui';
import { type ColumnDefinition } from '../../../../../sejong-ui';
import { SimulationSubject } from '@/utils/types.ts';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess.ts';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal.ts';
import { formatTMNum } from '@/utils/simulation/formators.ts';

const columns: ColumnDefinition<SimulationSubject>[] = [
  {
    header: '순번',
    cell: (_, index) => index + 1,
  },
  {
    header: '삭제',
    cell: () => <SejongUI.Button size="sm">삭제</SejongUI.Button>,
  },
  {
    header: '학수번호',
    cell: subject => subject.subjectCode,
  },
  {
    header: '분반',
    cell: subject => subject.classCode,
  },
  {
    header: '개설학과',
    cell: subject => <div className="text-left">{subject.departmentName}</div>,
  },
  {
    header: '교과목명',
    cell: subject => <div className="text-left">{subject.subjectName}</div>,
  },
  {
    header: '수업계획서',
    cell: () => (
      <SejongUI.Button size="sm" variant="dark">
        수업계획서
      </SejongUI.Button>
    ),
  },
  {
    header: '강의언어',
    cell: subject => subject.language,
  },
  {
    header: '학점/이론/실습',
    cell: subject => formatTMNum(subject.tm_num),
  },
  {
    header: '이수',
    cell: subject => subject.subjectType,
  },
  {
    header: '재수강',
    cell: () => '-',
  },
  {
    header: '시간표',
    cell: subject => subject.lesn_time,
  },
  {
    header: '인원보기',
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

  const subjects =
    currentSimulation.simulationStatus === 'progress' && currentModal !== 'waiting'
      ? currentSimulation.registeredSubjects
      : [];

  return <SejongUI.DataTable columns={columns} data={subjects} keyInfo="subjectId" />;
};

export default RegisteredTable;

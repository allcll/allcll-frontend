import { useSimulationModalStore } from '@/store/simulation/useSimulationModal.ts';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess.ts';
import useSimulationSubjectStore from '@/store/simulation/useSimulationSubject.ts';
import { BUTTON_EVENT, triggerButtonEvent } from '@/utils/simulation/simulation.ts';
import useLectures from '@/entities/subjects/model/useLectures.ts';
import SejongUI, { type ColumnDefinition } from '../../../../../sejong-ui';
import { SimulationSubject } from '@/utils/types.ts';
import { formatSemesterAt, formatTMNum } from '@/utils/simulation/formators.ts';

const columns: ColumnDefinition<SimulationSubject>[] = [
  {
    header: '순번',
    cell: (_, index) => index + 1,
  },
  {
    header: '신청',
    cell: subject => <SubmitButton subjectId={subject.subjectId} />,
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
    header: '학년',
    cell: subject => formatSemesterAt(subject.semester_at),
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

const NoneRegisteredTable = () => {
  const currentSimulation = useSimulationProcessStore(state => state.currentSimulation);
  const currentModal = useSimulationModalStore(state => state.type);

  const subjects =
    currentSimulation.simulationStatus === 'progress' && currentModal !== 'waiting'
      ? currentSimulation.nonRegisteredSubjects
      : [];

  return <SejongUI.DataTable columns={columns} data={subjects} keyInfo="subjectId" />;
};

/** 신청을 따로 정의 */
const SubmitButton = ({ subjectId }: { subjectId: number }) => {
  const openModal = useSimulationModalStore(state => state.openModal);
  const setCurrentSubjectId = useSimulationSubjectStore(state => state.setCurrentSubjectId);
  const { data: lectures } = useLectures();

  const handleClickSubject = (subjectId: number) => {
    triggerButtonEvent({ eventType: BUTTON_EVENT.APPLY, subjectId }, lectures)
      .then(result => {
        if ('errMsg' in result) {
          alert(result.errMsg);
        }
      })
      .catch(e => {
        console.error('예외 발생:', e);
      });

    setCurrentSubjectId(subjectId);
    openModal('captcha');
  };

  return (
    <SejongUI.Button size="sm" onClick={() => handleClickSubject(subjectId)}>
      신청
    </SejongUI.Button>
  );
};

export default NoneRegisteredTable;

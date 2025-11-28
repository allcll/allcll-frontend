import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import useSimulationSubjectStore from '@/store/simulation/useSimulationSubject';
import { BUTTON_EVENT, triggerButtonEvent } from '@/utils/simulation/simulation';
import useLectures from '@/hooks/server/useLectures';
import SejongUI, { type ColumnDefinition } from '@allcll/sejong-ui';
import { SimulationSubject } from '@/utils/types.ts';

const columns: ColumnDefinition<SimulationSubject>[] = [
  {
    header: '순번',
    accessorKey: 'subjectId', // accessorKey는 필수지만 cell 함수에서 덮어쓰므로 아무거나 넣어도 무방
    cell: (_, index) => index + 1,
  },
  {
    header: '신청',
    accessorKey: 'subjectId',
    cell: subject => (
      <SejongUI.Button size="sm" onClick={() => console.log(subject.subjectId)}>
        신청
      </SejongUI.Button>
    ),
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
    header: '학년',
    accessorKey: 'semester_at',
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

const NoneRegisteredTable = () => {
  const currentSimulation = useSimulationProcessStore(state => state.currentSimulation);
  const currentModal = useSimulationModalStore(state => state.type);
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

  const displayColumns = getDynamicColumns(columns).map<ColumnDefinition<SimulationSubject>>(col => {
    if (col.header !== '신청') {
      return col;
    }

    return {
      ...col,
      cell: subject => (
        <SejongUI.Button size="sm" onClick={() => handleClickSubject(subject.subjectId)}>
          신청
        </SejongUI.Button>
      ),
    };
  });

  const subjects =
    currentSimulation.simulationStatus === 'progress' && currentModal !== 'waiting'
      ? currentSimulation.nonRegisteredSubjects
      : [];

  return <SejongUI.DataTable columns={displayColumns} data={subjects} />;
};

export function getDynamicColumns(columns: ColumnDefinition<SimulationSubject>[]) {
  return columns.map<ColumnDefinition<SimulationSubject>>(col => {
    switch (col.header) {
      case '학년':
        return {
          ...col,
          cell: subject => (subject.semester_at === -1 ? '' : subject.semester_at),
        };
      case '학점/이론/실습':
        return {
          ...col,
          cell: subject =>
            subject.tm_num
              ? subject.tm_num
                  .split('/')
                  .map((num: string, i: number) => (i === 0 ? parseFloat(num).toFixed(1) : num))
                  .join('/')
              : '-',
        };
      default:
        return col;
    }
  });
}

export default NoneRegisteredTable;

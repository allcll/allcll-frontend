import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationSubjectStore from '@/store/simulation/useSimulationSubject';
import { BUTTON_EVENT, triggerButtonEvent } from '@/utils/simulation/simulation';
import SubjectRow from './SubjectRow';
import NothingTable from './NothingTable';
import useLectures, { Lecture } from '@/hooks/server/useLectures';

interface ISubjectsTable {
  isRegisteredTable: boolean;
  lectures: Lecture[];
}

const SubjectsTable = ({ lectures, isRegisteredTable }: ISubjectsTable) => {
  const openModal = useSimulationModalStore(state => state.openModal);
  const setCurrentSubjectId = useSimulationSubjectStore(state => state.setCurrentSubjectId);
  const { data } = useLectures();

  const handleClickSubject = (subjectId: number) => {
    triggerButtonEvent({ eventType: BUTTON_EVENT.APPLY, subjectId }, data)
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

  return lectures.length > 0 ? (
    lectures.map((subject, idx) => (
      <tbody key={subject.subjectId} className="min-h-[300px] border-gray-100">
        <SubjectRow
          index={idx}
          subject={subject}
          isRegisteredTable={isRegisteredTable}
          onClickSubject={handleClickSubject}
        />
      </tbody>
    ))
  ) : (
    <NothingTable />
  );
};

export default SubjectsTable;

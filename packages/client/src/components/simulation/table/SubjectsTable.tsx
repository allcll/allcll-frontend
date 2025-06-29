import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import useSimulationSubjectStore from '@/store/simulation/useSimulationSubject';
import { BUTTON_EVENT, triggerButtonEvent } from '@/utils/simulation/simulation';
import SubjectRow from './SubjectRow';
import NothingTable from './NothingTable';

interface ISubjectsTable {
  isRegisteredTable: boolean;
}

const SubjectsTable = ({ isRegisteredTable }: ISubjectsTable) => {
  const { currentSimulation } = useSimulationProcessStore();
  const { openModal } = useSimulationModalStore();
  const { setCurrentSubjectId } = useSimulationSubjectStore();

  const handleClickSubject = (subjectId: number) => {
    triggerButtonEvent({ eventType: BUTTON_EVENT.APPLY, subjectId })
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

  const filteredNonRegistered = currentSimulation.nonRegisteredSubjects.filter(subject => {
    return !currentSimulation.registeredSubjects.some(
      registeredSubject => registeredSubject.subjectId === subject.subjectId,
    );
  });

  const subjectsToRender = isRegisteredTable ? currentSimulation.registeredSubjects : filteredNonRegistered;

  return (
    <tbody className="min-h-[300px] border-gray-100">
      {subjectsToRender.length > 0 ? (
        subjectsToRender.map((subject, idx) => (
          <SubjectRow
            key={subject.subjectId}
            index={idx}
            subject={subject}
            isRegisteredTable={isRegisteredTable}
            onClickSubject={handleClickSubject}
          />
        ))
      ) : (
        <NothingTable />
      )}
    </tbody>
  );
};

export default SubjectsTable;

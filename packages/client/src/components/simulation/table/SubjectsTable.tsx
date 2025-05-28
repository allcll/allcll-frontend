import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import useSimulationSubjectStore from '@/store/simulation/useSimulationSubject';
import { APPLY_STATUS, BUTTON_EVENT, triggerButtonEvent } from '@/utils/simulation/simulation';
import SubjectRow from './SubjectRow';

interface ISubjectsTable {
  isRegisteredTable: boolean;
}

const SubjectsTable = ({ isRegisteredTable }: ISubjectsTable) => {
  const { currentSimulation } = useSimulationProcessStore();
  const { openModal } = useSimulationModalStore();
  const { currentSubjectId, setCurrentSubjectId, setSubjectStatus } = useSimulationSubjectStore();
  const { subjectsStatus, setSubjectsStatus } = useSimulationProcessStore();

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

    const doubledSubject = subjectsStatus.find(subject => subject.subjectId === subjectId);
    setCurrentSubjectId(subjectId);

    if (
      doubledSubject?.subjectStatus === APPLY_STATUS.SUCCESS ||
      doubledSubject?.subjectStatus === APPLY_STATUS.DOUBLED
    ) {
      setSubjectStatus(currentSubjectId, APPLY_STATUS.DOUBLED);
      setSubjectsStatus(currentSubjectId, APPLY_STATUS.DOUBLED);
      openModal('captcha');
    } else {
      openModal('captcha');
    }
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
        <tr>
          <td colSpan={13} className="text-gray-400 py-4">
            조회된 내역이 없습니다.
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default SubjectsTable;

import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import useSimulationSubjectStore from '@/store/simulation/useSimulationSubject';
import { BUTTON_EVENT, triggerButtonEvent } from '@/utils/simulation/simulation';
import SubjectRow from './SubjectRow';
import NothingTable from './NothingTable';
import useLectures from '@/hooks/server/useLectures';

interface ISubjectsTable {
  isRegisteredTable: boolean;
}

const SubjectsTable = ({ isRegisteredTable }: ISubjectsTable) => {
  const { currentSimulation } = useSimulationProcessStore();
  const { openModal } = useSimulationModalStore();
  const { setCurrentSubjectId } = useSimulationSubjectStore();
  const lectures = useLectures();

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

  const mergeNonRegisteredAndFailed = currentSimulation.nonRegisteredSubjects.concat(currentSimulation.failedSubjects);

  const subjectsToRender = isRegisteredTable ? currentSimulation.successedSubjects : mergeNonRegisteredAndFailed;

  return (
    <>
      {subjectsToRender.length > 0 ? (
        subjectsToRender.map((subject, idx) => (
          <tbody className="min-h-[300px] border-gray-100">
            <SubjectRow
              key={subject.subjectId}
              index={idx}
              subject={subject}
              isRegisteredTable={isRegisteredTable}
              onClickSubject={handleClickSubject}
            />
          </tbody>
        ))
      ) : (
        <NothingTable />
      )}
    </>
  );
};

export default SubjectsTable;

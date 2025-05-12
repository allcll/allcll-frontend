import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import useSimulationSubjectStore from '@/store/simulation/useSimulationSubject';
import { APPLY_STATUS, BUTTON_EVENT, triggerButtonEvent } from '@/utils/simulation/simulation';

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
        subjectsToRender.map((course, idx) => (
          <tr key={course.subjectId} className="hover:bg-gray-50">
            <td className="border border-gray-300 bg-blue-100 px-2 py-1">{idx + 1}</td>
            <td className="border border-gray-300 px-2 py-1">
              <button
                className="bg-blue-500 cursor-pointer text-white text-xs px-2 py-0.5 rounded-xs"
                disabled={!!isRegisteredTable}
                onClick={() => handleClickSubject(course.subjectId)}
              >
                {isRegisteredTable ? '삭제' : '신청'}
              </button>
            </td>
            <td className="border border-gray-300 px-2 py-1">{course.subjectCode}</td>
            <td className="border border-gray-300 px-2 py-1">{course.classCode}</td>
            <td className="border border-gray-300 px-2 py-1">{course.departmentName}</td>
            <td className="border border-gray-300 px-2 py-1">{course.subjectName}</td>
            <td className="border border-gray-300 px-2 py-1">
              <button className="bg-gray-700 text-xs text-white rounded-xs px-2 py-0.5 ">수업계획서</button>
            </td>
            <td className="border border-gray-300 px-2 py-1">{course.language || '-'}</td>
            <td className="border border-gray-300 px-2 py-1">{course.tm_num}</td>
            <td className="border border-gray-300 px-2 py-1">{course.subjectType}</td>
            <td className="border border-gray-300 px-2 py-1">{course.semester_at}</td>
            <td className="border border-gray-300 px-2 py-1">{course.lesn_time || '-'}</td>
            <td className="border border-gray-300 px-2 py-1">
              <button className="bg-gray-700 text-white text-xs px-2 py-0.5 rounded-xs">수강인원</button>
            </td>
          </tr>
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

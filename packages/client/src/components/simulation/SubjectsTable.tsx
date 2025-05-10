import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import useSimulationSubjectStore from '@/store/simulation/useSimulationSubject';

const SubjectsTable = () => {
  const { simulation } = useSimulationProcessStore();
  const { openModal } = useSimulationModalStore();
  const { currentSubjectId, setCurrentSubjectId, setSubjectStatus } = useSimulationSubjectStore();
  const { subjectsStatus, setSubjectsStatus } = useSimulationProcessStore();

  const isDuplicate = true;
  const handleClickSubject = (subjectId: number) => {
    /**
     * TODO: 이미 신청 한 과목인지 확인
     */

    //이미 신청 한 과목인지 확인
    setCurrentSubjectId(subjectId);

    const doubledSubject = subjectsStatus.find(subject => subject.subjectId === currentSubjectId);

    /**
     * 이미 수강 신청한 과목일 경우 DOUBLED로 상태 변경
     * 처음 수강 신청한 과목 : 캡챠 열기
     */
    if (doubledSubject?.subjectStatus === 'SUCCESS' || doubledSubject?.subjectStatus === 'DOUBLED') {
      setSubjectStatus(currentSubjectId, 'DOUBLED');
      setSubjectsStatus(currentSubjectId, 'DOUBLED');
      openModal('simulation');
    } else {
      openModal('captcha');
    }

    if (isDuplicate) {
      setSubjectStatus(currentSubjectId, 'DOUBLED');
    }
  };

  return (
    <tbody>
      {simulation.subjects.length > 0 ? (
        simulation.subjects.map((course, idx) => (
          <tr key={course.subjectId} className="hover:bg-gray-50">
            <td className="border border-gray-300 bg-blue-100 px-2 py-1">{idx + 1}</td>
            <td className="border border-gray-300 px-2 py-1">
              <button
                className="bg-blue-500 cursor-pointer text-white text-xs px-2 py-0.5 rounded-xs"
                onClick={() => handleClickSubject(course.subjectId)}
              >
                신청
              </button>
            </td>
            <td className="border border-gray-300 px-2 py-1">{course.subjectCode}</td>
            <td className="border border-gray-300 px-2 py-1">{course.classCode}</td>
            <td className="border border-gray-300 px-2 py-1">{course.departmentName}</td>
            <td className="border border-gray-300 px-2 py-1">{course.subjectName}</td>
            <td className="border border-gray-300 px-2 py-1">
              <button className="bg-gray-200 text-xs rounded-xs px-2 py-0.5 ">수업계획서</button>
            </td>
            <td className="border border-gray-300 px-2 py-1">{course.language || '-'}</td>
            <td className="border border-gray-300 px-2 py-1">{course.semester_at}</td>
            <td className="border border-gray-300 px-2 py-1">{course.subjectType}</td>
            <td className="border border-gray-300 px-2 py-1">{course.semester_at}</td>
            <td className="border border-gray-300 px-2 py-1">{course.lesn_time || '-'}</td>
            <td className="border border-gray-300 px-2 py-1">
              <button className="bg-gray-200 text-xs px-2 py-0.5 rounded-xs">수강인원</button>
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

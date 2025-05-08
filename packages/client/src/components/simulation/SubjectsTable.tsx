import useSimulation from '@/store/useSimulation';
import { useSimulationModal } from '@/store/useSimulationModal';

const SubjectsTable = () => {
  const { subjects } = useSimulation();
  const { openModal } = useSimulationModal();

  const handleClickSubject = () => {
    openModal('waiting');
  };

  return (
    <tbody>
      {subjects.length > 0 ? (
        subjects.map((course, idx) => (
          <tr key={course.subjectId} className="hover:bg-gray-50">
            <td className="border border-gray-300 bg-blue-100 px-2 py-1">{idx + 1}</td>
            <td className="border border-gray-300 px-2 py-1">
              <button
                className="bg-blue-500 cursor-pointer text-white text-xs px-2 py-0.5 rounded"
                onClick={handleClickSubject}
              >
                신청
              </button>
            </td>
            <td className="border border-gray-300 px-2 py-1">{course.subjectCode}</td>
            <td className="border border-gray-300 px-2 py-1">{course.classCode}</td>
            <td className="border border-gray-300 px-2 py-1">{course.departmentName}</td>
            <td className="border border-gray-300 px-2 py-1">{course.subjectName}</td>
            <td className="border border-gray-300 px-2 py-1">
              <button className="bg-gray-200 text-xs px-2 py-0.5 rounded">수업계획서</button>
            </td>
            <td className="border border-gray-300 px-2 py-1">{course.language || '-'}</td>
            <td className="border border-gray-300 px-2 py-1">{course.semester_at}</td>
            <td className="border border-gray-300 px-2 py-1">{course.subjectType}</td>
            <td className="border border-gray-300 px-2 py-1">{course.semester_at}</td>
            <td className="border border-gray-300 px-2 py-1">{course.lesn_time || '-'}</td>
            <td className="border border-gray-300 px-2 py-1">
              <button className="bg-gray-200 text-xs px-2 py-0.5 rounded">수강인원</button>
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

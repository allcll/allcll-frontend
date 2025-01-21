import {Link} from 'react-router-dom';

const PinnedCourses = () => {
  return (
    <div>
      <div className="flex justify-between align-baseline mb-2">
        <h2 className="font-bold text-lg mb-4">핀 고정된 과목</h2>
        <Link to="/search" className="text-blue-500 mt-4">+ 핀 과목 추가</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 shadow-sm rounded-lg p-4">
          <div>
            <h3 className="font-bold">프로그래밍 기초</h3>
            <button area-label='핀 버튼'>핀</button>
          </div>
          <p className="text-sm text-gray-500">CS101 | 김교수</p>
          <p className="text-sm text-green-500">여석: 2</p>
        </div>
        <div className="bg-gray-50 shadow-sm rounded-lg p-4">
          <h3 className="font-bold">경영학원론</h3>
          <p className="text-sm text-gray-500">BA201 | 이교수</p>
          <p className="text-sm text-red-500">여석: 0</p>
        </div>
      </div>
    </div>
  );
};

export default PinnedCourses;

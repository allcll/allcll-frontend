import {Link} from 'react-router-dom';
import PinIcon from './svgs/PinIcon';

export interface Course {
  id: number;
  code: string;
  name: string;
  professor: string;
  credits: number;
  seats: number;
}

const dummyCourses: Course[] = [
  {id: 1, code: 'CS101', name: '프로그래밍 기초', professor: '김교수', credits: 3, seats: 2},
  {id: 2, code: 'BA201', name: '경영학원론', professor: '이교수', credits: 3, seats: 0},
  {id: 3, code: 'CS201', name: '자료구조', professor: '박교수', credits: 3, seats: 5},
  {id: 4, code: 'BA201', name: '경영학원론', professor: '이교수', credits: 3, seats: 0},
  {id: 5, code: 'CS201', name: '자료구조', professor: '박교수', credits: 3, seats: 5},
];

const PinnedCourses = () => {
  return (
    <div>
      <div className="flex justify-between align-baseline mb-2">
        <h2 className="font-bold text-lg mb-4">핀 고정된 과목</h2>
        <Link to="/search" className="text-blue-500 font-bold mt-4">+ 핀 과목 추가</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dummyCourses.map((course) => (
          <PinCard key={course.id} course={course}/>
        ))}
      </div>
    </div>
  );
};


function PinCard({ course }: { course: Course }) {
  return (
    <div className="bg-gray-50 shadow-sm rounded-lg p-4">
      <div className="flex justify-between mb-2">
        <h3 className="font-bold">{course.name}</h3>
        <button area-label='핀 제거'>
          <PinIcon/>
        </button>
      </div>
      <p className="text-sm text-gray-500">{course.code} | {course.professor}</p>
      <p className={`text-sm ${seatColor(course.seats)}`}>여석: {course.seats}</p>
    </div>
  );
}

function seatColor(seats: number) {
  if (seats > 5)
    return 'text-green-500';
  if (seats > 0)
    return 'text-yellow-500';
  return 'text-red-500';
}

export default PinnedCourses;

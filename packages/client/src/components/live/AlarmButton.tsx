import { Link } from 'react-router-dom';

function AlarmButton() {
  return (
    <Link
      to="/live/search"
      className="p-2 rounded-full flex items-center justify-center"
      aria-label="여석 알림 과목 추가"
      title="여석 알림 과목 추가"
    >
      <div className="bg-gray-50 rounded-full px-4 py-2 text-sm border border-gray-200 hover:shadow-md">
        + 알림 과목 등록
      </div>
    </Link>
  );
}

export default AlarmButton;

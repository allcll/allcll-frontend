import LogList from '@/components/logs/LogList';
import RequestLogs from '@/components/logs/RequestLogs';

function Logs() {
  return (
    <div className="p-6 space-y-10">
      <h1 className="text-lg text-gray-700 font-bold mb-4">로그 설정</h1>
      <p className="text-gray-600">로그 페이지입니다.</p>

      <RequestLogs />
      <LogList />
    </div>
  );
}

export default Logs;

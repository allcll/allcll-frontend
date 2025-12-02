import { AdminApiLogs } from '@/utils/dbConfig';
import LogItem from './LogItem';

interface ILogList {
  logs: AdminApiLogs[];
}

function LogList({ logs }: ILogList) {
  return (
    <div className="min-h-0 px-2 overflow-y-auto touch-auto flex flex-col">
      <h2 className="text-md font-semibold mb-3">로그 목록</h2>
      <p className="text-gray-600 mb-4">시스템 로그를 확인할 수 있습니다.</p>
      <span className="text-sm font-medium">전체 로그</span>

      <div className="overflow-y-hidden p-2 rounded-md bg-gray-200 shadow-sm">
        <div className="flex flex-col gap-2">
          {logs.map(log => (
            <LogItem key={log.request_id} log={log} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LogList;

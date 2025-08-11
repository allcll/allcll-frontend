import Card from '@allcll/common/components/Card';
import InfoChip from '@allcll/common/components/chip/InfoChip';
import { AdminApiLogs } from '@/utils/dbConfig';

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
            <Card key={log.request_id} className="p-3">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <InfoChip
                    type={log.statusCode === 200 ? 'success' : 'error'}
                    label={`${log.statusCode}`}
                    className="mb-1"
                  />
                  <p className="text-sm text-gray-800">{log.request_url}</p>
                </div>

                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">메서드:</span>{' '}
                  <span className="text-md text-blue-500">{log.method}</span>
                </p>

                <p className="text-sm text-gray-500 break-all">
                  <span className="font-semibold text-gray-700">요청시간: </span>
                  {log.timestamp}
                </p>
                <pre className="text-sm text-gray-500 whitespace-pre-wrap break-all">
                  <span className="font-semibold text-gray-700">요청Body:</span>{' '}
                  {JSON.stringify(log.request_body, null, 2)}
                </pre>
                <pre className="text-sm text-gray-500 whitespace-pre-wrap break-all">
                  <span className="font-semibold text-gray-700">응답값:</span>{' '}
                  {JSON.stringify(log.response_body, null, 2)}
                </pre>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LogList;

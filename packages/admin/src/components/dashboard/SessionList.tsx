import { useCheckAdminSession } from '@/hooks/server/session/useAdminSession';
import { formatTime } from '@/utils/formatTime';
import { Badge, Card } from '@allcll/allcll-ui';

function SessionList() {
  const { data: sessionStatus, isLoading, error } = useCheckAdminSession();

  return (
    <Card>
      <h2 className="text-lg text-gray-700 font-bold mb-4">세션 목록</h2>

      <div className="w-full bg-white shadow rounded-lg p-6 overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-sm text-gray-500">
              <th className="px-3 py-2 text-center font-medium">학번</th>
              <th className="px-3 py-2 text-center font-medium">시작 시간</th>
              <th className="px-3 py-2 text-center font-medium">인증 세션 활성 여부</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-gray-400 text-sm">
                  불러오는 중...
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-sm">
                  세션 정보를 불러오지 못했습니다.
                </td>
              </tr>
            )}

            {!isLoading && !error && sessionStatus?.length === 0 && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-gray-400 text-sm">
                  현재 실행 중인 세션이 없습니다.
                </td>
              </tr>
            )}

            {sessionStatus?.map((data, idx) => (
              <tr key={data?.userId ?? idx} className="text-sm text-gray-700 border-b hover:bg-gray-50 transition">
                <td className="px-3 py-2 text-center">{data?.userId}</td>
                <td className="px-3 py-2 text-center">{formatTime(data?.startTime ?? '')}</td>
                <td className="px-3 py-2 text-center">
                  <Badge variant={data?.isActive ? 'success' : 'danger'}>{data?.isActive ? 'ON' : 'OFF'}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default SessionList;

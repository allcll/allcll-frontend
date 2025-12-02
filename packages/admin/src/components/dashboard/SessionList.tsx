import { useCheckAdminSession } from '@/hooks/server/session/useAdminSession';
import { formatTime } from '@/utils/formatTime';
import Card from '@allcll/common/components/Card';
import InfoChip from '@allcll/common/components/chip/InfoChip';

function SessionList() {
  const { data: sessionStatus, isLoading, error } = useCheckAdminSession();

  return (
    <Card>
      <h2 className="text-lg text-gray-700 font-bold mb-4">세션 목록</h2>

      <div className="w-full bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-3 px-3 py-2 bg-gray-50 text-sm text-gray-500">
          <div className="text-center">학번</div>
          <div className="text-center">시작 시간</div>
          <div className="text-center">인증 세션 활성 여부</div>
        </div>

        {isLoading && <div className="py-6 text-center text-gray-400 text-sm">불러오는 중...</div>}
        {error && <div className="py-6 text-center text-sm">세션 정보를 불러오지 못했습니다.</div>}
        {!isLoading && !error && sessionStatus?.length === 0 && (
          <div className="py-6 text-center text-gray-400 text-sm">현재 실행 중인 세션이 없습니다.</div>
        )}

        {sessionStatus?.map((data, idx) => (
          <div
            key={data?.userId ?? idx}
            className="grid grid-cols-3 px-3 py-2 text-sm text-gray-700 border-b hover:bg-gray-50 transition"
          >
            <div className="text-center">{data?.userId}</div>
            <div className="text-center">{formatTime(data?.startTime ?? '')}</div>
            <div className={`text-center font-medium ${data?.isActive ? 'text-green-600' : 'text-red-500'}`}>
              <InfoChip label={data?.isActive ? 'ON' : 'OFF'} type={data?.isActive ? 'success' : 'error'} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default SessionList;

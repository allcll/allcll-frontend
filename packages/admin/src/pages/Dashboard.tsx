import StatusCard from '@/components/dashboard/StatusCard';
import ServiceOpen from '@/components/dashboard/ServiceOpen';
import { useCheckSessionAlive } from '@/hooks/server/session/useCheckService';
import { useCheckCrawlerSeat } from '@/hooks/server/clawlers/useSeatClawlers';
import { useCheckSseScheduler } from '@/hooks/server/sse/useSeatScheduler';
import SesstionList from '@/components/dashboard/SessionList';

export enum SystemStatusKey {
  SESSION = 'SESSION',
  SEAT = 'SEAT',
  SSE_CONNECTION = 'SSE_CONNECTION',
  SSE_DATA = 'SSE_DATA',
}

export const STATUS_CONFIG = {
  [SystemStatusKey.SESSION]: {
    title: '인증 세션',
  },
  [SystemStatusKey.SEAT]: {
    title: '여석 크롤링',
  },
  [SystemStatusKey.SSE_CONNECTION]: {
    title: 'SSE 연결',
  },
  [SystemStatusKey.SSE_DATA]: {
    title: 'SSE 여석 데이터',
  },
} as const;

function Dashboard() {
  const { data: isActiveSession } = useCheckSessionAlive();
  const { data: isActiveSeat } = useCheckCrawlerSeat();
  const { data: isSentSseData } = useCheckSseScheduler();

  const statusData = {
    [SystemStatusKey.SESSION]: !!isActiveSession,
    [SystemStatusKey.SEAT]: !!isActiveSeat,
    [SystemStatusKey.SSE_CONNECTION]: false, // TODO: SSE 연결 체크 구현 예정
    [SystemStatusKey.SSE_DATA]: !!isSentSseData,
  };

  return (
    <div className="p-6 space-y-10">
      <section>
        <h2 className="text-lg text-gray-700 font-bold mb-4">시스템 모니터링</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <StatusCard key={key} title={config.title} status={statusData[key as SystemStatusKey] ? 'ON' : 'OFF'} />
          ))}
        </div>
      </section>

      {/* <DataUpdateSection /> */}
      <SesstionList />
      <ServiceOpen />
    </div>
  );
}

export default Dashboard;

import StatusCard from '@/components/dashboard/StatusCard';
import ServiceOpen from '@/components/dashboard/ServiceOpen';
import SesstionList from '@/components/dashboard/SessionList';
import { useSystemStatus } from '@/hooks/useSystemStatus';

export enum SystemStatusKey {
  SESSION = 'SESSION',
  SEAT = 'SEAT',
  SSE_CONNECTION = 'SSE_CONNECTION',
  SSE_DATA = 'SSE_DATA',
}

export const STATUS_CONFIG = {
  [SystemStatusKey.SESSION]: { title: '인증 세션' },
  [SystemStatusKey.SEAT]: { title: '여석 크롤링' },
  [SystemStatusKey.SSE_CONNECTION]: { title: 'SSE 연결' },
  [SystemStatusKey.SSE_DATA]: { title: 'SSE 여석 데이터' },
} as const;

function Dashboard() {
  const statusData = useSystemStatus();

  return (
    <div className="p-6 space-y-10">
      <section>
        <h2 className="text-lg text-gray-700 font-bold mb-4">시스템 모니터링</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(STATUS_CONFIG).map(([key, config]) => {
            const { active, description } = statusData[key as SystemStatusKey];
            return (
              <StatusCard key={key} title={config.title} status={active ? 'ON' : 'OFF'} description={description} />
            );
          })}
        </div>
      </section>

      <SesstionList />
      <ServiceOpen />
    </div>
  );
}

export default Dashboard;

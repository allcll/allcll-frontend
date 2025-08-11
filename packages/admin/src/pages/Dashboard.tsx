import StatusCard from '@/components/dashboard/StatusCard';
import DataUpdateSection from '@/components/dashboard/DataUpdateSection';
import ServiceOpen from '@/components/dashboard/ServiceOpen';
import { useCheckSessionAlive } from '@/hooks/server/session/useCheckService';
import { useCheckCrawlerSeat } from '@/hooks/server/clawlers/useSeatClawlers';
import { useCheckSseScheduler } from '@/hooks/server/sse/useSeatScheduler';

function Dashboard() {
  const { data: isActiveSession } = useCheckSessionAlive();
  const { data: isActiveSeat } = useCheckCrawlerSeat();
  const { data: isSentSseData } = useCheckSseScheduler();

  const statusData = [
    { title: '인증상태', status: !!isActiveSession },
    { title: '여석 크롤링', status: !!isActiveSeat },
    { title: 'SSE 연결', status: false },
    { title: 'SSE 여석 데이터', status: !!isSentSseData },
  ];

  console.log(isActiveSession, isActiveSeat, isSentSseData);
  return (
    <div className="p-6 space-y-10">
      <section>
        <h2 className="text-lg text-gray-700 font-bold mb-4">시스템 모니터링</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {statusData.map(({ title, status }) => (
            <StatusCard key={title} title={title} status={status ? 'ON' : 'OFF'} />
          ))}
        </div>
      </section>

      <DataUpdateSection />
      <ServiceOpen />
    </div>
  );
}

export default Dashboard;

import StatusCard from '@/components/dashboard/StatusCard';
import DataUpdateSection from '@/components/dashboard/DataUpdateSection';
import ServiceOpen from '@/components/dashboard/ServiceOpen';

const STATUS_DATA = [
  { title: '인증상태', status: 'ON' },
  { title: '여석 크롤링', status: 'ON' },
  { title: 'SSE 연결', status: 'OFF' },
  { title: 'SSE 여석 데이터', status: 'ON' },
];

function Dashboard() {
  return (
    <div className="p-6 space-y-10">
      <section>
        <h2 className="text-lg text-gray-700 font-bold mb-4">시스템 모니터링</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {STATUS_DATA.map(({ title, status }) => (
            <StatusCard key={title} title={title} status={status} />
          ))}
        </div>
      </section>

      <DataUpdateSection />
      <ServiceOpen />
    </div>
  );
}

export default Dashboard;

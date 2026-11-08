import ServiceOpen from '@/components/dashboard/ServiceOpen';
import SesstionList from '@/components/dashboard/SessionList';
import PageHeader from '@/components/common/PageHeader';
import SystemChecking from '@/components/dashboard/SystemChecking';

function Dashboard() {
  return (
    <>
      <PageHeader title="대시보드" description="대시보드 페이지입니다." />

      <main className="space-y-5">
        <SystemChecking />
        <SesstionList />
        <ServiceOpen />
      </main>
    </>
  );
}

export default Dashboard;

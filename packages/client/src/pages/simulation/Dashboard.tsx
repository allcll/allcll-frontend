import { Helmet } from 'react-helmet';
import AllResult from '@/components/simulation/AllResult.tsx';
import SimulationList from '@/components/simulation/SimulationList.tsx';

function Dashboard() {
  return (
    <>
      <Helmet>
        <title>ALLCLL | 대시보드</title>
      </Helmet>

      <section className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">수강신청 결과</h1>
        <p className="text-gray-500 mb-4">수강연습 결과를 분석 후, 부족한 부분을 알려 드려요.</p>

        <div className="bg-white p-3 rounded-md text-sm shadow-md shadow-gray-300">
          <AllResult />
        </div>
      </section>

      <section className="max-w-3xl mx-auto mt-12">
        <SimulationList />
      </section>
    </>
  );
}

export default Dashboard;

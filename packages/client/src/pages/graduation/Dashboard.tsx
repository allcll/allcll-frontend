import GraduationDashboardPage from '@/pages/graduation/GraduationDashboardPage.tsx';
import { Helmet } from 'react-helmet';

function Dashboard() {
  return (
    <>
      <Helmet>
        <title>ALLCLL | 졸업요건검사 결과</title>
        <meta name="description" content="세종대학교 졸업요건검사를 도와드립니다." />
      </Helmet>
      <GraduationDashboardPage />
    </>
  );
}

export default Dashboard;

import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import GraduationDashboardPage from '@/pages/graduation/GraduationDashboardPage.tsx';
import StepErrorBoundary from '@/features/graduation/ui/setup/StepErrorBoundary';
import useJolupSteps, { JolupSteps } from '@/features/graduation/lib/useJolupSteps.ts';

function Dashboard() {
  const { step } = useJolupSteps();
  const navigate = useNavigate();

  useEffect(() => {
    if (step !== JolupSteps.RESULT) {
      navigate('/graduation');
    }
  }, [step]);

  return (
    <>
      <Helmet>
        <title>ALLCLL | 졸업요건검사 결과</title>
        <meta name="description" content="세종대학교 졸업요건검사를 도와드립니다." />
      </Helmet>
      <StepErrorBoundary resetKey={step}>
        <GraduationDashboardPage />
      </StepErrorBoundary>
    </>
  );
}

export default Dashboard;

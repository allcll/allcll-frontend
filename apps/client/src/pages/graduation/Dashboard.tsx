import { useEffect } from 'react';
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
    <StepErrorBoundary resetKey={step}>
      <GraduationDashboardPage />
    </StepErrorBoundary>
  );
}

export default Dashboard;

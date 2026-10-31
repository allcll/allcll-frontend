import { Flex, LoadingState } from '@allcll/allcll-ui';
import useJolupSteps from '@/features/graduation/lib/useJolupSteps.ts';
import StepErrorBoundary from './StepErrorBoundary';
import StepIndicator from './StepIndicator';
import StepContent from './StepContent';

function GraduationSettingSteps() {
  const { step, nextStep, prevStep, isLoading, isDepartmentNotFound, setIsDepartmentNotFound } = useJolupSteps();

  if (isLoading) {
    return <LoadingState className="min-h-[50vh]" />;
  }

  return (
    <Flex direction="flex-col" gap="gap-4" className="w-full max-w-4xl mx-auto p-4">
      <StepIndicator currentStep={step} />

      <StepErrorBoundary resetKey={step}>
        <StepContent
          step={step}
          nextStep={nextStep}
          prevStep={prevStep}
          isDepartmentNotFound={isDepartmentNotFound}
          setIsDepartmentNotFound={setIsDepartmentNotFound}
        />
      </StepErrorBoundary>
    </Flex>
  );
}

export default GraduationSettingSteps;

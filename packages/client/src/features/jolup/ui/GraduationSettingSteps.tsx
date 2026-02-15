import { Flex } from '@allcll/allcll-ui';
import useJolupSteps, { JolupSteps } from '@/features/jolup/lib/useJolupSteps.ts';
import StepErrorBoundary from './StepErrorBoundary';
import StepIndicator from './StepIndicator';
import StepContent from './StepContent';
import Loading from '@/shared/ui/Loading';

function GraduationSettingSteps() {
  const { step, nextStep, prevStep, setStep, isLoading, isDepartmentNotFound, setIsDepartmentNotFound } =
    useJolupSteps();

  // Step 에러 핸들러
  const handleError = (error: Error) => {
    const message = error.message;

    if (message.includes('401') || message.includes('Unauthorized')) {
      setStep(JolupSteps.LOGIN);
    } else if (message.includes('학과') || message.includes('Major') || message.includes('기본 정보')) {
      setStep(JolupSteps.DEPARTMENT_INFO);
    } else {
      setStep(JolupSteps.FILE_UPLOAD);
    }
  };

  if (isLoading) {
    return (
      <Flex direction="flex-col" justify="justify-center" align="items-center" className="min-h-[50vh]">
        <Loading />
      </Flex>
    );
  }

  return (
    <Flex direction="flex-col" gap="gap-4" className="w-full max-w-4xl mx-auto p-4">
      <StepIndicator currentStep={step} />

      <StepErrorBoundary onError={handleError} resetKey={step}>
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

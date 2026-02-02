import useJolupSteps, { JolupSteps } from '@/features/jolup/lib/useJolupSteps.ts';
import FileUpload from '@/features/jolup/ui/FileUpload.tsx';
import { Button, Flex } from '@allcll/allcll-ui';
import FileUploadGuide from '@/features/jolup/ui/FileUploadGuide.tsx';
import StepIndicator from './StepIndicator';
import BasicInfoForm from './BasicInfoForm';
import Uploading from '@/features/jolup/ui/Uploading.tsx';

/**
 * 각 기능은 이 인터페이스를 참조하면 좋겠습니다. */
export interface JolupStepsProps {
  nextStep: () => void;
}

function Steps() {
  const { step, nextStep } = useJolupSteps();

  return (
    <Flex direction="flex-col" gap="gap-8" className="w-full max-w-4xl mx-auto px-4">
      <StepIndicator currentStep={step} />

      {renderStepContent(step, nextStep)}
    </Flex>
  );
}

function renderStepContent(step: JolupSteps, nextStep: () => void) {
  switch (step) {
    case JolupSteps.LOGIN:
      return <DefaultStep nextStep={nextStep}>Login Step</DefaultStep>;
    case JolupSteps.BASIC_INFO:
      return <BasicInfoForm nextStep={nextStep} />;
    case JolupSteps.FILE_UPLOAD:
      return (
        <Flex direction="flex-col" gap="gap-6">
          <FileUpload nextStep={nextStep} />
          <FileUploadGuide />
        </Flex>
      );
    case JolupSteps.UPLOADING:
      return <Uploading nextStep={nextStep} />;
    default:
      return <DefaultStep nextStep={nextStep}>Unknown Step</DefaultStep>;
  }
}

function DefaultStep({ nextStep, children }: { children: React.ReactNode } & JolupStepsProps) {
  return (
    <div>
      <h1>{children}</h1>
      <Button onClick={nextStep} variant="primary" size="small">
        다음
      </Button>
    </div>
  );
}

export default Steps;

import React from 'react';
import useJolupSteps, { JolupSteps } from '@/features/jolup/lib/useJolupSteps.ts';
import { Button, Flex } from '@allcll/allcll-ui';
import FileUpload from '@/features/jolup/ui/FileUpload.tsx';
import Uploading from '@/features/jolup/ui/Uploading.tsx';
import FileUploadGuide from '@/features/jolup/ui/FileUploadGuide.tsx';
import StepIndicator from './StepIndicator';
import BasicInfoForm from './BasicInfoForm';
import LoginForm from '@/features/user/ui/LoginForm';

/**
 * 각 기능은 이 인터페이스를 참조하면 좋겠습니다. */
export interface JolupStepsProps {
  nextStep: () => void;
  prevStep: () => void;
}

function Steps() {
  const { step, nextStep, prevStep, isDepartmentNotFound, setIsDepartmentNotFound } = useJolupSteps();

  return (
    <Flex direction="flex-col" gap="gap-4" className="w-full max-w-4xl mx-auto p-4">
      <StepIndicator currentStep={step} />

      {renderStepContent(step, nextStep, prevStep, isDepartmentNotFound, setIsDepartmentNotFound)}
    </Flex>
  );
}

function renderStepContent(
  step: JolupSteps,
  nextStep: () => void,
  prevStep: () => void,
  isDepartmentNotFound: boolean,
  setIsDepartmentNotFound: (value: boolean) => void,
) {
  switch (step) {
    case JolupSteps.LOGIN:
      return (
        <LoginForm onSuccess={nextStep} onDepartmentNotFound={() => setIsDepartmentNotFound(true)} />
      );
    case JolupSteps.BASIC_INFO:
      return (
        <BasicInfoForm nextStep={nextStep} prevStep={prevStep} isDepartmentNotFound={isDepartmentNotFound} />
      );
    case JolupSteps.FILE_UPLOAD:
      return (
        <Flex direction="flex-col" gap="gap-6">
          <FileUpload nextStep={nextStep} prevStep={prevStep} />
          <FileUploadGuide />
        </Flex>
      );
    case JolupSteps.UPLOADING:
      return <Uploading nextStep={nextStep} prevStep={prevStep} />;
    default:
      return (
        <DefaultStep nextStep={nextStep} prevStep={prevStep}>
          Unknown Step
        </DefaultStep>
      );
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

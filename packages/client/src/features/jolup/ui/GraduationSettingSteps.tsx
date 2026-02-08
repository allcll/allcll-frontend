import React from 'react';
import { Button, Flex } from '@allcll/allcll-ui';
import useJolupSteps, { JolupSteps } from '@/features/jolup/lib/useJolupSteps.ts';
import FileUploadGuide from '@/features/jolup/ui/FileUploadGuide.tsx';
import { JolupStepsProps } from '@/features/jolup/model/types.ts';
import FileUpload from '@/features/jolup/ui/FileUpload.tsx';
import Uploading from '@/features/jolup/ui/Uploading.tsx';
import LoginForm from '@/features/user/ui/LoginForm';
import StepIndicator from './StepIndicator';
import BasicInfoForm from './BasicInfoForm';

function GraduationSettingSteps() {
  const { step, nextStep, prevStep } = useJolupSteps();

  return (
    <Flex direction="flex-col" gap="gap-4" className="w-full max-w-4xl mx-auto p-4">
      <StepIndicator currentStep={step} />

      {renderStepContent(step, nextStep, prevStep)}
    </Flex>
  );
}

function renderStepContent(step: JolupSteps, nextStep: () => void, prevStep: () => void) {
  switch (step) {
    case JolupSteps.LOGIN:
      return <LoginForm onSuccess={nextStep} />;
    case JolupSteps.DEPARTMENT_INFO:
      return <BasicInfoForm nextStep={nextStep} prevStep={prevStep} />;
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

export default GraduationSettingSteps;

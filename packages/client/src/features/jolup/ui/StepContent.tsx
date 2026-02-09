import React from 'react';
import { Button, Flex } from '@allcll/allcll-ui';
import { JolupSteps } from '@/features/jolup/lib/useJolupSteps.ts';
import FileUploadGuide from '@/features/jolup/ui/FileUploadGuide.tsx';
import { JolupStepsProps } from '@/features/jolup/model/types.ts';
import FileUpload from '@/features/jolup/ui/FileUpload.tsx';
import Uploading from '@/features/jolup/ui/Uploading.tsx';
import LoginForm from '@/features/user/ui/LoginForm';
import BasicInfoForm from './BasicInfoForm';

interface StepContentProps {
  step: JolupSteps;
  nextStep: () => void;
  prevStep: () => void;
}

const StepContent: React.FC<StepContentProps> = ({ step, nextStep, prevStep }) => {
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
};

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

export default StepContent;

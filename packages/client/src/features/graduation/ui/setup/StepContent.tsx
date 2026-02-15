import React, { useState } from 'react';
import { Button, Flex } from '@allcll/allcll-ui';
import { JolupSteps } from '@/features/graduation/lib/useJolupSteps.ts';
import FileUploadGuide from '@/features/graduation/ui/setup/FileUploadGuide.tsx';
import { JolupStepsProps } from '@/features/graduation/model/types.ts';
import FileUpload from '@/features/graduation/ui/setup/FileUpload.tsx';
import Uploading from '@/features/graduation/ui/setup/Uploading.tsx';
import LoginForm from '@/features/user/ui/LoginForm';
import BasicInfoForm from './BasicInfoForm';

interface StepContentProps {
  step: JolupSteps;
  nextStep: () => void;
  prevStep: () => void;
  isDepartmentNotFound?: boolean;
  setIsDepartmentNotFound?: (value: boolean) => void;
}

const StepContent: React.FC<StepContentProps> = ({ step, nextStep, prevStep, isDepartmentNotFound, setIsDepartmentNotFound }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  switch (step) {
    case JolupSteps.LOGIN:
      return <LoginForm onSuccess={nextStep} onDepartmentNotFound={() => setIsDepartmentNotFound?.(true)} />;
    case JolupSteps.DEPARTMENT_INFO:
      return <BasicInfoForm nextStep={nextStep} prevStep={prevStep} isDepartmentNotFound={isDepartmentNotFound} />;
    case JolupSteps.FILE_UPLOAD:
      return (
        <Flex direction="flex-col" gap="gap-6">
          <FileUpload nextStep={nextStep} prevStep={prevStep} file={uploadedFile} onFileSelected={setUploadedFile} />
          <FileUploadGuide />
        </Flex>
      );
    case JolupSteps.UPLOADING:
      return <Uploading nextStep={nextStep} prevStep={prevStep} file={uploadedFile} />;
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

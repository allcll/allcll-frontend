import React from 'react';
import { Step, Line } from '@allcll/common';
import { JolupSteps } from '@/features/graduation/lib/useJolupSteps.ts';

interface StepIndicatorProps {
  currentStep: JolupSteps;
}

const steps = [
  { id: JolupSteps.LOGIN, label: '로그인' },
  { id: JolupSteps.DEPARTMENT_INFO, label: '기본 정보' },
  { id: JolupSteps.FILE_UPLOAD, label: '파일 업로드' },
  { id: JolupSteps.UPLOADING, label: '업로드 중' },
];

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="flex items-start md:items-center w-full py-4 px-2 gap-2">
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index <= currentStepIndex;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <Step number={index + 1} finish={isCompleted} active={isCurrent} label={step.label} />
            {!isLast && <Line active={index + 1 <= currentStepIndex} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;

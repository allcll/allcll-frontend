import React from 'react';
import { Flex } from '@allcll/allcll-ui';
import { JolupSteps } from '@/features/jolup/lib/useJolupSteps.ts';

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
    <Flex justify="justify-center" align="items-center" className="w-full py-8 px-2">
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <Flex direction="flex-col" align="items-center" gap="gap-1" className="relative z-10 shrink-0">
              <div
                className={`
                  w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-colors duration-300
                  ${isCompleted || isCurrent ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}
                `}
              >
                {isCompleted ? (
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-medium whitespace-nowrap ${isCurrent ? 'text-primary' : 'text-gray-500'}`}
              >
                {step.label}
              </span>
            </Flex>

            {!isLast && (
              <div className="flex-1 h-[2px] bg-gray-200 mx-1 sm:mx-2 -mt-5 sm:-mt-6 min-w-[20px]">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </Flex>
  );
};

export default StepIndicator;

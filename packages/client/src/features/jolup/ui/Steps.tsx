import useJolupSteps, { JolupSteps } from '@/features/jolup/lib/useJolupSteps.ts';
import FileUpload from '@/features/jolup/ui/FileUpload.tsx';
import { Button } from '@allcll/allcll-ui';

/**
 * 각 기능은 이 인터페이스를 참조하면 좋겠습니다. */
export interface JolupStepsProps {
  nextStep: () => void;
}

function Steps() {
  const { step, nextStep } = useJolupSteps();

  // 각각 맞는 헨더링을 넣어주시면 됩니다.
  switch (step) {
    case JolupSteps.LOGIN:
      return <DefaultStep nextStep={nextStep}>Login Step</DefaultStep>;
    case JolupSteps.FILE_UPLOAD:
      return <FileUpload nextStep={nextStep} />;
    case JolupSteps.UPLOADING:
      return <DefaultStep nextStep={nextStep}>Uploading Step</DefaultStep>;
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

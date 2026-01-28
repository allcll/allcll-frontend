import useJolupSteps, { JolupSteps } from '@/features/jolup/lib/useJolupSteps.ts';
import FileUpload from '@/features/jolup/ui/FileUpload.tsx';

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
      return <div>Login Step</div>;
    case JolupSteps.FILE_UPLOAD:
      return <FileUpload nextStep={nextStep} />;
    case JolupSteps.UPLOADING:
      return <div>Uploading Step</div>;
    default:
      return <div>Unknown Step</div>;
  }
}

export default Steps;

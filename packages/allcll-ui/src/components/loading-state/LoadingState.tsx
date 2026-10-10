import { AllcllFaceIcon } from '../../icons';

interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
}

function LoadingState({
  title = '데이터를 불러오는 중이에요.',
  description = '잠시만 기다려 주세요.',
  className = '',
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-1 text-center ${className}`}
    >
      <AllcllFaceIcon
        mood="smile"
        aria-hidden="true"
        className="mb-1 w-10 h-10 text-primary-500 animate-[spin_1.5s_linear_infinite]"
      />
      <p className="text-sm font-medium text-gray-600">{title}</p>
      {description && <p className="text-xs text-gray-400">{description}</p>}
    </div>
  );
}

export default LoadingState;

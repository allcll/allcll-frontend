import { SpinnerIcon } from '../../icons';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  label?: string;
  className?: string;
}

const SIZE_CLASS = {
  small: 'w-4 h-4',
  medium: 'w-6 h-6',
  large: 'w-10 h-10',
};

function Spinner({ size = 'medium', label = '불러오는 중', className = '' }: SpinnerProps) {
  return (
    <span role="status" className={`inline-flex ${className}`}>
      <SpinnerIcon aria-hidden="true" className={`animate-spin text-primary-500 ${SIZE_CLASS[size]}`} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default Spinner;

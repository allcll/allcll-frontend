interface IInfoChip {
  label: string;
  type: 'success' | 'error' | 'neutral';
  className?: string;
}

const colorClasses = {
  success: 'bg-green-100 text-green-500',
  error: 'bg-red-100 text-red-500',
  neutral: 'bg-gray-100 text-gray-500',
};

function InfoChip({ label, type, className = '' }: IInfoChip) {
  return (
    <span
      className={`flex justify-center items-center px-3 py-1 text-xs font-bold rounded-full max-w-15 inline-block ${colorClasses[type]} ${className}`}
    >
      {label}
    </span>
  );
}

export default InfoChip;

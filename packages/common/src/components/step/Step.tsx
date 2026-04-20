import CheckSvg from '@/assets/check.svg?react';

interface StepProps {
  number: number;
  finish?: boolean;
  active: boolean;
  label: string;
}

function Step({ number, finish, active, label }: StepProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-0.5 md:gap-2 shrink-0">
      <div
        className={`w-8 h-8 flex items-center justify-center rounded-full border
          ${active ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-400'}
        `}
      >
        {finish ? <CheckSvg className="w-4 h-4" /> : <span className="text-xs">{number}</span>}
      </div>

      <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">{label}</span>
    </div>
  );
}

export default Step;

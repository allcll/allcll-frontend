import { Flex } from '@allcll/allcll-ui';
import CheckSvg from '@/assets/check.svg?react';

interface StepProps {
  number: number;
  finish?: boolean;
  active: boolean;
  label: string;
}

function Step({ number, finish, active, label }: StepProps) {
  return (
    <Flex align="items-center">
      <div
        className={`w-8 h-8 flex items-center justify-center rounded-full border 
          ${active ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-400'}
        `}
      >
        {finish ? <CheckSvg className="w-4 h-4" /> : <span className="text-xs">{number}</span>}
      </div>

      <span className="text-sm text-gray-600">{label}</span>
    </Flex>
  );
}

export default Step;

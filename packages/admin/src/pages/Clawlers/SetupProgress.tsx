import CheckSvg from '@/assets/check.svg?react';
import { SetupStep } from '@/utils/type';

function SetupProgress({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-4">
      <Step number={SetupStep.TOKEN} active={current >= SetupStep.TOKEN} label="인증 정보 세팅" />
      <Line active={current >= SetupStep.CONTROL} />
      <Step number={SetupStep.CONTROL} active={current >= SetupStep.CONTROL} label="크롤러 제어" />
    </div>
  );
}

function Step({ number, active, label }: { number: number; active: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 flex items-center justify-center rounded-full border 
          ${active ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-400'}
        `}
      >
        {active ? <CheckSvg className="w-4 h-4" /> : <span className="text-xs">{number}</span>}
      </div>

      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
}

function Line({ active }: { active: boolean }) {
  return <div className={`flex-1 h-[2px] ${active ? 'bg-blue-500' : 'bg-gray-300'}`}></div>;
}

export default SetupProgress;

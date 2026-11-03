import { CheckmarkIcon } from '@allcll/allcll-ui';

function GameTips() {
  return (
    <ul className="space-y-1.5 text-left text-xs">
      {[
        '시작 시 우측 검색 버튼을 빠르게 눌러주세요.',
        '인기 있는 과목을 먼저 잡으세요.',
        '한 번 담은 과목을 또 담지 않도록 주의하세요!',
        '모든 과목을 담은 즉시 종료됩니다.',
      ].map((tip, idx) => (
        <li key={tip} className="flex items-start gap-1.5">
          <CheckmarkIcon className="w-3 h-3 mt-0.5 shrink-0 text-primary-300" />
          <span className={idx === 0 ? 'font-semibold' : 'text-gray-200'}>{tip}</span>
        </li>
      ))}
    </ul>
  );
}

export default GameTips;

import CheckSvg from '@/assets/check.svg?react';

function GameTips() {
  return (
    <div className="mt-6 text-sm text-gray-800 space-y-2">
      <h2 className="text-left font-semibold mb-4">
        게임 <span className="text-blue-500">Tip!</span>
      </h2>
      {[
        '시작 시 우측 검색 버튼을 빠르게 눌러주세요.',
        '인기 있는 과목을 먼저 잡으세요.',
        '한 번 담은 과목을 또 담지 않도록 주의하세요!',
        '모든 과목을 담은 즉시 종료됩니다.',
      ].map((tip, idx) => (
        <div key={idx} className="flex items-center sm:text-sm text-xs ">
          <span className="text-blue-500 mr-2">
            <CheckSvg />
          </span>
          <span className={idx === 0 ? 'font-semibold text-blue-500 animate-bounce' : ''}>{tip}</span>
        </div>
      ))}
    </div>
  );
}

export default GameTips;

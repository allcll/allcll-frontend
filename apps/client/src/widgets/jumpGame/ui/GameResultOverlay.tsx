import type { SVGProps } from 'react';

const RESTART_ICON_SIZE = 32;

function RestartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={32} height={32} fill="currentColor" {...props}>
      <rect x={11} y={6} width={10} height={2} />
      <rect x={9} y={8} width={2} height={2} />
      <rect x={7} y={10} width={2} height={12} />
      <rect x={9} y={22} width={2} height={2} />
      <rect x={11} y={24} width={12} height={2} />
      <rect x={23} y={22} width={2} height={2} />
      <rect x={25} y={14} width={2} height={8} />
      <rect x={21} y={8} width={6} height={2} />
      <rect x={23} y={6} width={4} height={2} />
      <rect x={25} y={4} width={2} height={2} />
    </svg>
  );
}

interface IGameResultOverlayProps {
  message: string;
  onRestart: () => void;
}

/**
 * 게임이 끝났을 때 결과 문구와 다시 시작 버튼을 띄웁니다.
 * 오버레이 자체는 클릭을 통과시켜, 스테이지 아무 곳이나 눌러도 다시 시작할 수 있게 합니다.
 */
function GameResultOverlay({ message, onRestart }: Readonly<IGameResultOverlayProps>) {
  return (
    <div className="absolute inset-x-0 top-2 flex flex-col items-center gap-2 pointer-events-none text-gray-600">
      <p className="font-mono text-xs font-semibold tracking-[0.4em]">{message}</p>
      <button
        type="button"
        aria-label="게임 다시 시작"
        className="pointer-events-auto focus:outline-none"
        onClick={event => {
          event.stopPropagation();
          onRestart();
        }}
      >
        <RestartIcon width={RESTART_ICON_SIZE} height={RESTART_ICON_SIZE} aria-hidden />
      </button>
    </div>
  );
}

export default GameResultOverlay;

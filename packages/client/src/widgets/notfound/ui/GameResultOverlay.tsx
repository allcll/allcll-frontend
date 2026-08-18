import RefreshSvg from '@/assets/notfound/refresh.svg?react';

const RESTART_ICON_SIZE = 32;

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
        <RefreshSvg width={RESTART_ICON_SIZE} height={RESTART_ICON_SIZE} aria-hidden />
      </button>
    </div>
  );
}

export default GameResultOverlay;

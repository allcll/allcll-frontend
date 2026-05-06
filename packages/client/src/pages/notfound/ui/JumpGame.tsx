import LogoCI from '@/assets/logo/ci.svg?react';
import LogoCIDead from '@/assets/logo/ci-dead.svg?react';
import CloudSvg from '@/assets/notfound/cloud.svg?react';
import RefreshSvg from '@/assets/notfound/refresh.svg?react';
import {
  CHARACTER_SIZE,
  CHARACTER_X,
  CLOUD_WIDTH,
  GROUND_OFFSET,
  GROUND_PATTERN_URL,
  OBSTACLE_Y,
  STAGE_HEIGHT,
} from '@/pages/notfound/lib/jumpGameConfig';
import { useJumpGame } from '@/pages/notfound/model/useJumpGame';
import ObstacleShape from '@/pages/notfound/ui/ObstacleShape';

const JumpGame = () => {
  const { gameState, obstacles, clouds, stageRef, characterRef, groundTextureRef, handleAction } = useJumpGame();

  return (
    <div
      ref={stageRef}
      tabIndex={0}
      role="application"
      aria-label="올클 점프 미니게임"
      onClick={handleAction}
      onTouchStart={e => {
        e.preventDefault();
        handleAction();
      }}
      className="relative w-full max-w-md overflow-hidden cursor-pointer select-none focus:outline-none"
      style={{ height: STAGE_HEIGHT }}
    >
      <div className="absolute inset-0 bg-gray-50" />

      {gameState === 'playing' &&
        clouds.map(c => (
          <div
            key={c.id}
            className="absolute"
            style={{
              top: c.y,
              transform: `translateX(${c.x}px)`,
              willChange: 'transform',
            }}
            aria-hidden
          >
            <CloudSvg width={CLOUD_WIDTH} height={12} aria-hidden />
          </div>
        ))}

      <div
        ref={groundTextureRef}
        className="absolute bottom-0 left-0 right-0 border-t-2 border-[#535353]"
        style={{
          height: GROUND_OFFSET,
          backgroundImage: GROUND_PATTERN_URL,
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'left bottom',
        }}
        aria-hidden
      />

      {gameState === 'playing' &&
        obstacles.map(o => (
          <div
            key={o.id}
            className="absolute"
            style={{
              left: 0,
              bottom: OBSTACLE_Y,
              width: o.width,
              height: o.height,
              transform: `translateX(${o.x}px)`,
              willChange: 'transform',
            }}
          >
            <ObstacleShape type={o.type} />
          </div>
        ))}

      <div
        ref={characterRef}
        className="absolute grayscale contrast-150"
        style={{
          left: CHARACTER_X,
          bottom: GROUND_OFFSET,
          width: CHARACTER_SIZE,
          height: CHARACTER_SIZE,
          willChange: 'transform',
        }}
      >
        {gameState === 'gameOver' ? (
          <LogoCIDead width={CHARACTER_SIZE} height={CHARACTER_SIZE} />
        ) : (
          <LogoCI width={CHARACTER_SIZE} height={CHARACTER_SIZE} />
        )}
      </div>

      {gameState === 'gameOver' && (
        <div className="absolute inset-x-0 top-2 flex flex-col items-center gap-2 pointer-events-none">
          <div className="font-mono text-xs font-semibold tracking-[0.4em] text-[#535353]">
            G A M E &nbsp;&nbsp;O V E R
          </div>
          <button
            type="button"
            aria-label="다시 시작"
            className="pointer-events-auto focus:outline-none"
            onClick={e => {
              e.stopPropagation();
              handleAction();
            }}
          >
            <RefreshSvg width={32} height={32} aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
};

export default JumpGame;

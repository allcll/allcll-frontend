import LogoCI from '@/assets/logo/ci.svg?react';
import LogoCIDead from '@/assets/logo/ci-dead.svg?react';
import BellTowerSvg from '@/assets/jumpGame/bell-tower.svg?react';
import CloudSvg from '@/assets/jumpGame/cloud.svg?react';
import {
  CHARACTER_SIZE,
  CHARACTER_X,
  CLOUD_HEIGHT,
  CLOUD_WIDTH,
  GROUND_OFFSET,
  GROUND_PATTERN_URL,
  OBSTACLE_Y,
  STAGE_HEIGHT,
  TOWER_HEIGHT,
  TOWER_INITIAL_X,
  TOWER_WIDTH,
} from '@/widgets/jumpGame/lib/gameConfig.ts';
import { PALETTE } from '@/widgets/jumpGame/lib/palette.ts';
import { useJumpGame } from '@/widgets/jumpGame/model/useJumpGame.ts';
import GameResultOverlay from '@/widgets/jumpGame/ui/GameResultOverlay.tsx';
import ObstacleShape from '@/widgets/jumpGame/ui/ObstacleShape.tsx';

function JumpGame() {
  const {
    gameStatus,
    endingPhase,
    obstacles,
    clouds,
    isColored,
    stageRef,
    characterRef,
    groundTextureRef,
    towerRef,
    registerObstacle,
    registerCloud,
    handleAction,
  } = useJumpGame();

  const isPlaying = gameStatus === 'playing';
  const palette = PALETTE[isColored ? 'color' : 'mono'];

  return (
    <div
      ref={stageRef}
      className="relative w-full max-w-md overflow-hidden select-none"
      style={{ height: STAGE_HEIGHT }}
    >
      <div className="absolute inset-0 bg-gray-50" />

      {isPlaying &&
        clouds.map(cloud => (
          <div
            key={cloud.id}
            ref={registerCloud(cloud.id)}
            className={`absolute top-0 left-0 ${palette.cloud}`}
            style={{ transform: `translate(${cloud.x}px, ${cloud.y}px)`, willChange: 'transform' }}
            aria-hidden
          >
            <CloudSvg width={CLOUD_WIDTH} height={CLOUD_HEIGHT} />
          </div>
        ))}

      <div
        ref={groundTextureRef}
        className="absolute bottom-0 left-0 right-0 border-t-2 border-gray-600"
        style={{
          height: GROUND_OFFSET,
          backgroundImage: GROUND_PATTERN_URL,
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'left bottom',
        }}
        aria-hidden
      />

      {isPlaying &&
        obstacles.map(obstacle => (
          <div
            key={obstacle.id}
            ref={registerObstacle(obstacle.id)}
            className={`absolute left-0 ${palette.obstacle}`}
            style={{
              bottom: OBSTACLE_Y,
              width: obstacle.width,
              height: obstacle.height,
              transform: `translateX(${obstacle.x}px)`,
              willChange: 'transform',
            }}
            aria-hidden
          >
            <ObstacleShape type={obstacle.type} />
          </div>
        ))}

      <div
        ref={characterRef}
        className="absolute"
        style={{
          left: CHARACTER_X,
          bottom: GROUND_OFFSET,
          width: CHARACTER_SIZE,
          height: CHARACTER_SIZE,
          filter: palette.characterFilter,
          willChange: 'transform',
        }}
        aria-hidden
      >
        {gameStatus === 'gameOver' ? (
          <LogoCIDead width={CHARACTER_SIZE} height={CHARACTER_SIZE} />
        ) : (
          <LogoCI width={CHARACTER_SIZE} height={CHARACTER_SIZE} />
        )}
      </div>

      {/* 종탑은 캐릭터보다 뒤에 그리면 안 됩니다. 캐릭터가 그 뒤로 걸어 들어가며 가려져야 하기 때문입니다 */}
      {endingPhase !== 'none' && (
        <div
          ref={towerRef}
          className={`absolute left-0 ${palette.tower}`}
          style={{
            bottom: GROUND_OFFSET,
            width: TOWER_WIDTH,
            height: TOWER_HEIGHT,
            transform: `translateX(${TOWER_INITIAL_X}px)`,
            willChange: 'transform',
          }}
          aria-hidden
        >
          <BellTowerSvg width="100%" height="100%" />
        </div>
      )}

      {/* 스테이지 전체가 조작 영역입니다. 버튼으로 두면 포커스와 Space·Enter 입력을 브라우저가 처리합니다 */}
      <button
        type="button"
        aria-label="올클 점프 미니게임"
        onClick={handleAction}
        className="absolute inset-0 cursor-pointer touch-manipulation"
      />

      {gameStatus === 'gameOver' && <GameResultOverlay message="GAME OVER" onRestart={handleAction} />}
      {gameStatus === 'cleared' && <GameResultOverlay message="CLEAR!" onRestart={handleAction} />}
    </div>
  );
}

export default JumpGame;

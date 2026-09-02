import { useEffect, useRef, useState } from 'react';
import { hasClearRecord, saveClearRecord } from '@/widgets/notfound/lib/clearRecord.ts';
import {
  DEFAULT_STAGE_WIDTH,
  GROUND_PATTERN_WIDTH,
  INVINCIBILITY_BLINK_INTERVAL,
  INVINCIBILITY_BLINK_OPACITY,
  MAX_FRAME_DELTA,
} from '@/widgets/notfound/lib/gameConfig.ts';
import { createGame, jump, updateGame } from '@/widgets/notfound/model/gameLogic.ts';
import type { EndingPhase, GameStatus, ICloud, IGameState, IObstacle } from '@/widgets/notfound/model/types.ts';

/** 키보드 조작이 페이지의 링크·버튼 동작을 가로채지 않도록 제외할 요소들 */
const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select';
const JUMP_KEY_CODES = ['Space', 'ArrowUp'];

/**
 * 404 페이지 점프 게임의 진행을 관리하는 훅입니다.
 *
 * 매 프레임 바뀌는 값은 리렌더링 비용이 크므로 게임 상태(IGameState)를 ref 에 두고 직접 수정하며,
 * 화면 갱신은 DOM 스타일을 직접 쓰거나(캐릭터·지면) 목록이 바뀔 때만 상태로 옮깁니다(장애물·구름).
 */
export function useJumpGame() {
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [endingPhase, setEndingPhase] = useState<EndingPhase>('none');
  const [obstacles, setObstacles] = useState<IObstacle[]>([]);
  const [clouds, setClouds] = useState<ICloud[]>([]);
  const [isColored, setIsColored] = useState(hasClearRecord);

  const stageRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const groundTextureRef = useRef<HTMLDivElement>(null);
  const towerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<IGameState | null>(null);

  const handleAction = () => {
    if (gameStatus === 'playing') {
      if (gameRef.current) jump(gameRef.current);
      return;
    }
    setGameStatus('playing');
  };

  // 마운트 시 한 번만 등록하고, 최신 핸들러는 ref 로 참조해 오래된 상태를 붙잡지 않게 합니다
  const handleActionRef = useRef(handleAction);
  handleActionRef.current = handleAction;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!JUMP_KEY_CODES.includes(event.code)) return;
      if (document.activeElement?.matches(INTERACTIVE_SELECTOR)) return;

      event.preventDefault();
      handleActionRef.current();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const stageWidth = stageRef.current?.clientWidth ?? DEFAULT_STAGE_WIDTH;
    const game = createGame(stageWidth);
    gameRef.current = game;

    setObstacles(game.obstacles);
    setClouds(game.clouds);
    setEndingPhase('none');

    let rafId = 0;
    let lastTime = performance.now();

    const render = () => {
      const { character, invincibility } = game;

      if (characterRef.current) {
        const isBlinking = invincibility > 0 && Math.floor(invincibility / INVINCIBILITY_BLINK_INTERVAL) % 2 === 0;

        characterRef.current.style.opacity = isBlinking ? String(INVINCIBILITY_BLINK_OPACITY) : '1';
        characterRef.current.style.transform = `translate(${character.offsetX}px, ${-character.y}px) rotate(${character.rotation}deg)`;
      }

      if (groundTextureRef.current) {
        groundTextureRef.current.style.backgroundPositionX = `${-(game.distance % GROUND_PATTERN_WIDTH)}px`;
      }

      if (towerRef.current) {
        towerRef.current.style.transform = `translateX(${game.towerX}px)`;
      }
    };

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, MAX_FRAME_DELTA);
      lastTime = now;

      updateGame(game, dt, stageRef.current?.clientWidth ?? stageWidth);
      render();

      setObstacles(game.obstacles);
      setClouds(game.clouds);
      setEndingPhase(game.phase);

      if (game.isCleared) {
        saveClearRecord();
        setIsColored(true);
        setGameStatus('cleared');
        return;
      }

      if (game.isDead) {
        setGameStatus('gameOver');
        return;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [gameStatus]);

  // 게임이 끝나면 캐릭터를 출발 자세로 되돌립니다
  useEffect(() => {
    if (gameStatus === 'playing' || !characterRef.current) return;

    characterRef.current.style.opacity = '1';
    characterRef.current.style.transform = 'translate(0px, 0px) rotate(0deg)';
  }, [gameStatus]);

  return {
    gameStatus,
    endingPhase,
    obstacles,
    clouds,
    isColored,
    stageRef,
    characterRef,
    groundTextureRef,
    towerRef,
    handleAction,
  };
}

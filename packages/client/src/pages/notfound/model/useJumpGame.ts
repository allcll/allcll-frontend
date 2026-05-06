import { useEffect, useRef, useState } from 'react';
import {
  AIR_FRAMES,
  CHARACTER_HITBOX_PADDING,
  CHARACTER_SIZE,
  CHARACTER_X,
  CLOUD_SPEED_RATIO,
  CLOUD_WIDTH,
  FIRST_SPAWN_DISTANCE,
  GRAVITY,
  GROUND_OFFSET,
  GROUND_PATTERN_WIDTH,
  INVINCIBILITY_FRAMES,
  JUMP_VELOCITY,
  MAX_GAP_DISTANCE,
  MAX_LIVES,
  MIN_GAP_DISTANCE,
  OBSTACLE_TYPES,
  OBSTACLE_Y,
  SPEED_INCREMENT,
  SPEED_INITIAL,
  SPEED_MAX,
} from '@/pages/notfound/lib/jumpGameConfig';
import type { Cloud, GameState, Obstacle } from '@/pages/notfound/model/types';

export function useJumpGame() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [clouds, setClouds] = useState<Cloud[]>([]);

  const stageRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const groundTextureRef = useRef<HTMLDivElement>(null);

  const posYRef = useRef(0);
  const velocityYRef = useRef(0);
  const isAirborneRef = useRef(false);
  const rotationRef = useRef(0);
  const rotationStartRef = useRef(0);
  const airFramesRef = useRef(0);

  const obstaclesRef = useRef<Obstacle[]>([]);
  const livesRef = useRef(MAX_LIVES);
  const scoreRef = useRef(0);
  const speedRef = useRef(SPEED_INITIAL);
  const distanceRef = useRef(0);
  const nextSpawnAtRef = useRef(FIRST_SPAWN_DISTANCE);
  const invincibilityRef = useRef(0);
  const obstacleIdRef = useRef(0);
  const cloudsRef = useRef<Cloud[]>([]);

  const handleAction = () => {
    if (gameState === 'idle' || gameState === 'gameOver') {
      setGameState('playing');
      return;
    }
    if (isAirborneRef.current) return;
    velocityYRef.current = JUMP_VELOCITY;
    isAirborneRef.current = true;
    rotationStartRef.current = rotationRef.current;
    airFramesRef.current = 0;
  };

  const handleActionRef = useRef(handleAction);
  handleActionRef.current = handleAction;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.code !== 'ArrowUp') return;
      const active = document.activeElement;
      if (active && active.matches('a, button, input, textarea, select')) return;
      e.preventDefault();
      handleActionRef.current();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    posYRef.current = 0;
    velocityYRef.current = 0;
    isAirborneRef.current = false;
    rotationRef.current = 0;
    rotationStartRef.current = 0;
    airFramesRef.current = 0;
    obstaclesRef.current = [];
    livesRef.current = MAX_LIVES;
    scoreRef.current = 0;
    speedRef.current = SPEED_INITIAL;
    distanceRef.current = 0;
    nextSpawnAtRef.current = FIRST_SPAWN_DISTANCE;
    invincibilityRef.current = 0;
    setObstacles([]);

    const initialStageWidth = stageRef.current?.clientWidth ?? 400;
    cloudsRef.current = [
      { id: 1, x: initialStageWidth * 0.2, y: 8 },
      { id: 2, x: initialStageWidth * 0.55, y: 24 },
      { id: 3, x: initialStageWidth * 0.85, y: 14 },
    ];
    setClouds(cloudsRef.current);

    if (characterRef.current) {
      characterRef.current.style.opacity = '1';
      characterRef.current.style.transform = 'translateY(0px) rotate(0deg)';
    }

    let rafId = 0;

    const loop = () => {
      velocityYRef.current -= GRAVITY;
      posYRef.current += velocityYRef.current;

      if (isAirborneRef.current) {
        airFramesRef.current += 1;
        const progress = Math.min(1, airFramesRef.current / AIR_FRAMES);
        rotationRef.current = rotationStartRef.current + 90 * progress;
      }

      if (posYRef.current <= 0) {
        const wasAirborne = isAirborneRef.current;
        posYRef.current = 0;
        velocityYRef.current = 0;
        isAirborneRef.current = false;
        if (wasAirborne) {
          rotationRef.current = rotationStartRef.current + 90;
        }
      }

      if (speedRef.current < SPEED_MAX) {
        speedRef.current += SPEED_INCREMENT;
      }

      obstaclesRef.current = obstaclesRef.current
        .map(o => ({ ...o, x: o.x - speedRef.current }))
        .filter(o => o.x + o.width > 0);

      distanceRef.current += speedRef.current;
      if (distanceRef.current >= nextSpawnAtRef.current) {
        const stageWidth = stageRef.current?.clientWidth ?? 600;
        const config = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
        obstacleIdRef.current += 1;
        obstaclesRef.current = [
          ...obstaclesRef.current,
          {
            id: obstacleIdRef.current,
            type: config.type,
            width: config.width,
            height: config.height,
            x: stageWidth,
          },
        ];
        const gap = MIN_GAP_DISTANCE + Math.random() * (MAX_GAP_DISTANCE - MIN_GAP_DISTANCE);
        nextSpawnAtRef.current = distanceRef.current + gap;
      }

      let gameEnded = false;
      if (invincibilityRef.current <= 0) {
        const charLeft = CHARACTER_X + CHARACTER_HITBOX_PADDING;
        const charRight = CHARACTER_X + CHARACTER_SIZE - CHARACTER_HITBOX_PADDING;
        const charBottom = GROUND_OFFSET + posYRef.current + CHARACTER_HITBOX_PADDING;
        const charTop = GROUND_OFFSET + posYRef.current + CHARACTER_SIZE - CHARACTER_HITBOX_PADDING;

        for (const o of obstaclesRef.current) {
          const oLeft = o.x;
          const oRight = o.x + o.width;
          const oBottom = OBSTACLE_Y;
          const oTop = OBSTACLE_Y + o.height;

          if (charRight > oLeft && charLeft < oRight && charTop > oBottom && charBottom < oTop) {
            invincibilityRef.current = INVINCIBILITY_FRAMES;
            livesRef.current -= 1;
            if (livesRef.current <= 0) {
              gameEnded = true;
            }
            break;
          }
        }
      } else {
        invincibilityRef.current -= 1;
      }

      scoreRef.current += 1;
      setObstacles(obstaclesRef.current);

      const stageW = stageRef.current?.clientWidth ?? 600;
      cloudsRef.current = cloudsRef.current.map(c => {
        let nx = c.x - speedRef.current * CLOUD_SPEED_RATIO;
        if (nx + CLOUD_WIDTH < 0) {
          nx = stageW + Math.random() * 200;
          return { ...c, x: nx, y: 12 + Math.random() * 40 };
        }
        return { ...c, x: nx };
      });
      setClouds(cloudsRef.current);

      if (groundTextureRef.current) {
        const offset = distanceRef.current % GROUND_PATTERN_WIDTH;
        groundTextureRef.current.style.backgroundPositionX = `-${offset}px`;
      }

      if (characterRef.current) {
        const flicker = invincibilityRef.current > 0 && Math.floor(invincibilityRef.current / 8) % 2 === 0;
        characterRef.current.style.opacity = flicker ? '0.4' : '1';
        characterRef.current.style.transform = `translateY(-${posYRef.current}px) rotate(${rotationRef.current}deg)`;
      }

      if (gameEnded) {
        if (characterRef.current) {
          characterRef.current.style.transform = 'translateY(0px) rotate(0deg)';
          characterRef.current.style.opacity = '1';
        }
        setGameState('gameOver');
        return;
      }

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);
  }, [gameState]);

  return {
    gameState,
    obstacles,
    clouds,
    stageRef,
    characterRef,
    groundTextureRef,
    handleAction,
  };
}

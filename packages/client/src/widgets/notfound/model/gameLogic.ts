import { getCharacterHitBox, getObstacleHitBox, isOverlapped } from '@/widgets/notfound/lib/collision.ts';
import {
  AIR_TIME,
  CLOUD_INITIAL_LAYOUT,
  CLOUD_RESPAWN_X_SPREAD,
  CLOUD_RESPAWN_Y_MIN,
  CLOUD_RESPAWN_Y_SPREAD,
  CLOUD_SPEED_RATIO,
  CLOUD_WIDTH,
  ENDING_APPROACH_SPEED,
  ENDING_DECEL_EASE,
  ENDING_DISTANCE,
  ENDING_ENTER_SPEED,
  ENDING_STOP_EASE,
  ENDING_STOP_THRESHOLD,
  FIRST_SPAWN_DISTANCE,
  GRAVITY,
  INVINCIBILITY_TIME,
  JUMP_VELOCITY,
  MAX_GAP_DISTANCE,
  MAX_LIVES,
  MIN_GAP_DISTANCE,
  OBSTACLE_CONFIGS,
  SPEED_ACCEL,
  SPEED_INITIAL,
  SPEED_MAX,
  TOWER_REST_MARGIN,
  TOWER_SPAWN_OFFSET,
  TOWER_WIDTH,
} from '@/widgets/notfound/lib/gameConfig.ts';
import type { IGameState } from '@/widgets/notfound/model/types.ts';

/** 점프해서 착지할 때까지 도는 각도 */
const JUMP_ROTATION = 90;

// 판이 바뀌어도 이어서 증가시켜, 다시 시작한 직후에도 이전 판과 같은 key 가 나오지 않게 합니다
let obstacleId = 0;
let cloudId = 0;

/**
 * 목표값으로 부드럽게 다가가는 보간입니다.
 * dt 가 커져도 목표를 지나치지 않도록 비율을 1 로 제한합니다.
 */
function approach(current: number, target: number, ease: number, dt: number): number {
  return current + (target - current) * Math.min(1, ease * dt);
}

export function createGame(stageWidth: number): IGameState {
  return {
    phase: 'none',
    character: {
      offsetX: 0,
      y: 0,
      velocityY: 0,
      isAirborne: false,
      rotation: 0,
      rotationAtJump: 0,
      airTime: 0,
    },
    obstacles: [],
    clouds: CLOUD_INITIAL_LAYOUT.map(({ xRatio, y }) => {
      cloudId += 1;
      return { id: cloudId, x: stageWidth * xRatio, y };
    }),
    towerX: stageWidth + TOWER_SPAWN_OFFSET,
    speed: SPEED_INITIAL,
    distance: 0,
    nextSpawnAt: FIRST_SPAWN_DISTANCE,
    lives: MAX_LIVES,
    invincibility: 0,
    isDead: false,
    isCleared: false,
  };
}

/** 점프 시작. 공중이거나 엔딩 연출 중이면 무시합니다 */
export function jump(game: IGameState): void {
  const { character } = game;
  if (character.isAirborne || game.phase === 'enter') return;

  character.velocityY = JUMP_VELOCITY;
  character.isAirborne = true;
  character.rotationAtJump = character.rotation;
  character.airTime = 0;
}

function updateCharacter(game: IGameState, dt: number): void {
  const { character } = game;

  character.velocityY -= GRAVITY * dt;
  character.y += character.velocityY * dt;

  if (character.isAirborne) {
    character.airTime += dt;
    const progress = Math.min(1, character.airTime / AIR_TIME);
    character.rotation = character.rotationAtJump + JUMP_ROTATION * progress;
  }

  if (character.y > 0) return;

  // 착지: 회전을 정확히 90도 단위로 맞춰 다음 점프가 어긋나지 않게 합니다
  if (character.isAirborne) {
    character.rotation = character.rotationAtJump + JUMP_ROTATION;
  }
  character.y = 0;
  character.velocityY = 0;
  character.isAirborne = false;
}

function updateSpeed(game: IGameState, dt: number, towerRestX: number): void {
  if (game.phase === 'none') {
    game.speed = Math.min(SPEED_MAX, game.speed + SPEED_ACCEL * dt);
    return;
  }
  if (game.phase !== 'approach') return;

  if (game.towerX > towerRestX) {
    game.speed = approach(game.speed, ENDING_APPROACH_SPEED, ENDING_DECEL_EASE, dt);
    return;
  }

  // 종탑이 자리 잡으면 화면을 완전히 멈추고, 캐릭터가 걸어 들어가는 단계로 넘어갑니다
  game.speed = approach(game.speed, 0, ENDING_STOP_EASE, dt);
  if (game.speed < ENDING_STOP_THRESHOLD && !game.character.isAirborne) {
    game.speed = 0;
    game.phase = 'enter';
  }
}

function spawnObstacle(game: IGameState, stageWidth: number): void {
  const config = OBSTACLE_CONFIGS[Math.floor(Math.random() * OBSTACLE_CONFIGS.length)];
  obstacleId += 1;

  game.obstacles = [...game.obstacles, { ...config, id: obstacleId, x: stageWidth }];
  game.nextSpawnAt = game.distance + MIN_GAP_DISTANCE + Math.random() * (MAX_GAP_DISTANCE - MIN_GAP_DISTANCE);
}

function updateObstacles(game: IGameState, moved: number, stageWidth: number): void {
  game.obstacles = game.obstacles
    .map(obstacle => ({ ...obstacle, x: obstacle.x - moved }))
    .filter(obstacle => obstacle.x + obstacle.width > 0);

  // 엔딩에 들어서면 새 장애물은 더 내보내지 않습니다
  if (game.phase !== 'none' || game.distance < game.nextSpawnAt) return;
  spawnObstacle(game, stageWidth);
}

function updateClouds(game: IGameState, moved: number, stageWidth: number): void {
  game.clouds = game.clouds.map(cloud => {
    const nextX = cloud.x - moved * CLOUD_SPEED_RATIO;
    if (nextX + CLOUD_WIDTH > 0) return { ...cloud, x: nextX };

    // 화면을 벗어난 구름은 오른쪽 밖에 다시 놓아 재활용합니다
    return {
      ...cloud,
      x: stageWidth + Math.random() * CLOUD_RESPAWN_X_SPREAD,
      y: CLOUD_RESPAWN_Y_MIN + Math.random() * CLOUD_RESPAWN_Y_SPREAD,
    };
  });
}

function updateCollision(game: IGameState, dt: number): void {
  if (game.invincibility > 0) {
    game.invincibility -= dt;
    return;
  }

  const characterBox = getCharacterHitBox(game.character.offsetX, game.character.y);
  const isHit = game.obstacles.some(obstacle => isOverlapped(characterBox, getObstacleHitBox(obstacle)));
  if (!isHit) return;

  game.invincibility = INVINCIBILITY_TIME;
  game.lives -= 1;
  game.isDead = game.lives <= 0;
}

interface IEndingUpdateParams {
  game: IGameState;
  dt: number;
  moved: number;
  stageWidth: number;
  towerRestX: number;
}

function updateEnding({ game, dt, moved, stageWidth, towerRestX }: IEndingUpdateParams): void {
  if (game.phase === 'approach') {
    // 종탑도 배경과 같은 속도로 흘러오다, 자리에 닿으면 벽처럼 멈춥니다
    game.towerX = Math.max(towerRestX, game.towerX - moved);
    return;
  }
  if (game.phase !== 'enter') return;

  // 캐릭터가 종탑 뒤를 지나 화면 밖으로 사라지면 클리어
  game.character.offsetX += ENDING_ENTER_SPEED * dt;
  game.isCleared = game.character.offsetX > stageWidth;
}

/** 한 프레임 진행합니다. dt 는 초 단위 경과 시간입니다 */
export function updateGame(game: IGameState, dt: number, stageWidth: number): void {
  const towerRestX = stageWidth - TOWER_WIDTH - TOWER_REST_MARGIN;

  updateCharacter(game, dt);
  updateSpeed(game, dt, towerRestX);

  const moved = game.speed * dt;
  game.distance += moved;

  updateObstacles(game, moved, stageWidth);
  updateClouds(game, moved, stageWidth);

  if (game.phase === 'none') {
    game.towerX = stageWidth + TOWER_SPAWN_OFFSET;
    if (game.distance >= ENDING_DISTANCE) {
      game.phase = 'approach';
    }
  }

  // 엔딩 연출 중에는 남은 장애물이 흘러나갈 뿐이므로 충돌만 계속 확인합니다
  if (game.phase !== 'enter') {
    updateCollision(game, dt);
  }

  updateEnding({ game, dt, moved, stageWidth, towerRestX });
}

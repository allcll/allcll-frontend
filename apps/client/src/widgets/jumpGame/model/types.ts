/** idle 은 시작 전, cleared 는 엔딩까지 도달한 상태입니다 */
export type GameStatus = 'idle' | 'playing' | 'cleared' | 'gameOver';

/**
 * 엔딩 진행 단계입니다.
 * - none: 평소 달리는 중
 * - approach: 속도를 줄이며 종탑이 화면 밖에서 흘러와 자리 잡는 중
 * - enter: 배경이 멈추고 캐릭터가 종탑 뒤로 걸어 들어가는 중
 */
export type EndingPhase = 'none' | 'approach' | 'enter';

export type ObstacleType = 'cactus-large' | 'cactus-small' | 'cactus-cluster';

export interface IObstacleConfig {
  type: ObstacleType;
  width: number;
  height: number;
}

export interface IObstacle extends IObstacleConfig {
  id: number;
  /** 스테이지 왼쪽 끝을 0 으로 하는 가로 위치 */
  x: number;
}

export interface ICloud {
  id: number;
  x: number;
  y: number;
}

/** 스테이지 왼쪽 아래를 원점으로 하는 사각 영역 */
export interface IHitBox {
  left: number;
  right: number;
  bottom: number;
  top: number;
}

export interface ICharacterState {
  /** 기본 위치(CHARACTER_X)에서 오른쪽으로 밀려난 거리. 엔딩에서만 0 이 아닙니다 */
  offsetX: number;
  /** 지면에서 떠 있는 높이 */
  y: number;
  velocityY: number;
  isAirborne: boolean;
  rotation: number;
  /** 이번 점프를 시작할 때의 각도(deg). 여기서 90도를 더해 착지합니다 */
  rotationAtJump: number;
  airTime: number;
}

/**
 * 한 판의 모든 진행 상태입니다.
 * React 렌더링과 무관하게 매 프레임 직접 수정하며, 훅이 이 값을 화면에 옮깁니다.
 */
export interface IGameState {
  phase: EndingPhase;
  character: ICharacterState;
  obstacles: IObstacle[];
  clouds: ICloud[];
  /** 종탑의 가로 위치. 엔딩 전에는 화면 밖에 있습니다 */
  towerX: number;
  speed: number;
  /** 지금까지 달린 총 거리 */
  distance: number;
  /** 다음 장애물이 나올 거리 */
  nextSpawnAt: number;
  lives: number;
  /** 남은 무적 시간 */
  invincibility: number;
  isDead: boolean;
  isCleared: boolean;
}

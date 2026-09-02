import groundPatternUrl from '@/assets/notfound/ground-pattern.svg';
import type { IObstacleConfig } from '@/widgets/notfound/model/types.ts';

/**
 * 점프 게임 설정값 모음입니다.
 * 거리는 px, 시간은 초 단위이며 속도·가속도는 px/s, px/s² 입니다.
 */

// --- 스테이지 ---

export const STAGE_HEIGHT = 120;
/** 스테이지 너비를 아직 측정하지 못했을 때 쓰는 기본값 */
export const DEFAULT_STAGE_WIDTH = 400;
/** 지면 띠의 두께. 캐릭터와 장애물은 이 위에 섭니다 */
export const GROUND_OFFSET = 8;
/** 지면 무늬 한 칸의 너비. 이 값으로 나눈 나머지만큼 배경을 밀어 스크롤을 표현합니다 */
export const GROUND_PATTERN_WIDTH = 40;
export const GROUND_PATTERN_URL = `url("${groundPatternUrl}")`;

// --- 캐릭터 ---

export const CHARACTER_SIZE = 36;
/** 캐릭터가 서 있는 가로 위치. 캐릭터는 제자리에 있고 배경이 왼쪽으로 흐릅니다 */
export const CHARACTER_X = 40;
/** 로고 모서리의 여백까지 부딪힌 것으로 처리하지 않도록, 충돌 판정을 그림보다 이만큼 좁힙니다 */
export const CHARACTER_HITBOX_PADDING = 6;

// --- 물리 ---

export const GRAVITY = 3600;
/** 최고 높이 약 60px 로, 가장 높은 장애물(30px)의 두 배를 확보합니다 */
export const JUMP_VELOCITY = 660;
/** 점프해서 다시 착지할 때까지 걸리는 시간. 공중에서 90도 회전하는 데 쓰입니다 */
export const AIR_TIME = (2 * JUMP_VELOCITY) / GRAVITY;
/** 탭을 오래 비웠다 돌아오면 dt 가 커져 캐릭터가 순간이동하므로, 한 프레임에 반영할 시간을 잘라냅니다 */
export const MAX_FRAME_DELTA = 0.05;

// --- 진행 속도 ---

export const SPEED_INITIAL = 280;
export const SPEED_MAX = 600;
/** 최고 속도까지 약 27초가 걸리는 가속도 */
export const SPEED_ACCEL = 12;

// --- 장애물 ---

export const FIRST_SPAWN_DISTANCE = 500;
export const MIN_GAP_DISTANCE = 420;
export const MAX_GAP_DISTANCE = 800;
/** 지면 무늬에 살짝 걸치도록 장애물을 띄우는 높이 */
export const OBSTACLE_GROUND_INSET = 2;
export const OBSTACLE_Y = GROUND_OFFSET + OBSTACLE_GROUND_INSET;

export const OBSTACLE_CONFIGS: IObstacleConfig[] = [
  { type: 'cactus-large', width: 28, height: 30 },
  { type: 'cactus-small', width: 20, height: 24 },
  { type: 'cactus-cluster', width: 32, height: 20 },
];

// --- 목숨 ---

export const MAX_LIVES = 1;
export const INVINCIBILITY_TIME = 1;
export const INVINCIBILITY_BLINK_INTERVAL = 0.13;
export const INVINCIBILITY_BLINK_OPACITY = 0.4;

// --- 구름 (배경) ---

export const CLOUD_WIDTH = 36;
export const CLOUD_HEIGHT = 12;
/** 구름이 지면보다 느리게 흘러 원근감을 만드는 비율 */
export const CLOUD_SPEED_RATIO = 0.4;
/** 게임 시작 시 구름을 놓을 가로 위치(스테이지 너비 대비 비율)와 높이 */
export const CLOUD_INITIAL_LAYOUT = [
  { xRatio: 0.2, y: 8 },
  { xRatio: 0.55, y: 24 },
  { xRatio: 0.85, y: 14 },
];
/** 화면 밖으로 나간 구름을 오른쪽에 다시 놓을 때 쓰는 무작위 범위 */
export const CLOUD_RESPAWN_X_SPREAD = 200;
export const CLOUD_RESPAWN_Y_MIN = 12;
export const CLOUD_RESPAWN_Y_SPREAD = 40;

// --- 엔딩 ---

/** 목숨 하나로 약 1분을 버텨야 하는 거리. 끝까지 도달한 소수만 엔딩을 보도록 일부러 길게 잡았습니다 */
export const ENDING_DISTANCE = 30000;

export const TOWER_WIDTH = 48;
export const TOWER_HEIGHT = 112;
/** 종탑이 처음 그려질 때 화면에 비치지 않도록 두는 위치. 다음 프레임에 실제 좌표로 덮입니다 */
export const TOWER_INITIAL_X = 9999;
/** 종탑이 화면 오른쪽 끝에서 이만큼 더 밖에서 등장해, 남은 장애물이 먼저 지나갈 여유를 줍니다 */
export const TOWER_SPAWN_OFFSET = 220;
/** 종탑이 멈춰 서는 위치. 화면 오른쪽 끝에서 이만큼 안쪽입니다 */
export const TOWER_REST_MARGIN = 24;

/** 엔딩이 시작되면 급정거처럼 보이지 않도록 이 속도까지 부드럽게 줄입니다 */
export const ENDING_APPROACH_SPEED = 280;
/** 감속·정지의 부드러움을 정하는 계수(1/s). 클수록 빨리 줄어듭니다 */
export const ENDING_DECEL_EASE = 2.5;
export const ENDING_STOP_EASE = 4;
/** 이 속도 아래로 떨어지면 완전히 멈춘 것으로 봅니다 */
export const ENDING_STOP_THRESHOLD = 15;
/** 배경이 멈춘 뒤 캐릭터가 종탑 뒤로 걸어 들어가는 속도 */
export const ENDING_ENTER_SPEED = 200;

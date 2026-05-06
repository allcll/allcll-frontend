import groundPatternUrl from '@/assets/notfound/ground-pattern.svg';
import type { ObstacleType } from '@/pages/notfound/model/types';

export const STAGE_HEIGHT = 120;
export const CHARACTER_SIZE = 36;
export const CHARACTER_X = 40;
export const CHARACTER_HITBOX_PADDING = 6;
export const GROUND_OFFSET = 8;

export const GRAVITY = 0.5;
export const JUMP_VELOCITY = 8;
export const AIR_FRAMES = (2 * JUMP_VELOCITY) / GRAVITY;

export const SPEED_INITIAL = 2.5;
export const SPEED_MAX = 6;
export const SPEED_INCREMENT = 0.001;

export const FIRST_SPAWN_DISTANCE = 500;
export const MIN_GAP_DISTANCE = 380;
export const MAX_GAP_DISTANCE = 720;

export const INVINCIBILITY_FRAMES = 60;
export const MAX_LIVES = 1;

export const OBSTACLE_Y = GROUND_OFFSET + 2;

export const CLOUD_SPEED_RATIO = 0.4;
export const CLOUD_WIDTH = 36;

export const GROUND_PATTERN_WIDTH = 40;
export const GROUND_PATTERN_URL = `url("${groundPatternUrl}")`;

export const OBSTACLE_TYPES: { type: ObstacleType; width: number; height: number }[] = [
  { type: 'cactus-large', width: 28, height: 30 },
  { type: 'cactus-small', width: 20, height: 24 },
  { type: 'cactus-cluster', width: 32, height: 20 },
];

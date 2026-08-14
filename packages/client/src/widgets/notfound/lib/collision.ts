import {
  CHARACTER_HITBOX_PADDING,
  CHARACTER_SIZE,
  CHARACTER_X,
  GROUND_OFFSET,
  OBSTACLE_Y,
} from '@/widgets/notfound/lib/gameConfig.ts';
import type { IHitBox, IObstacle } from '@/widgets/notfound/model/types.ts';

export function getCharacterHitBox(offsetX: number, y: number): IHitBox {
  const left = CHARACTER_X + offsetX + CHARACTER_HITBOX_PADDING;
  const bottom = GROUND_OFFSET + y + CHARACTER_HITBOX_PADDING;

  return {
    left,
    right: left + CHARACTER_SIZE - CHARACTER_HITBOX_PADDING * 2,
    bottom,
    top: bottom + CHARACTER_SIZE - CHARACTER_HITBOX_PADDING * 2,
  };
}

export function getObstacleHitBox(obstacle: IObstacle): IHitBox {
  return {
    left: obstacle.x,
    right: obstacle.x + obstacle.width,
    bottom: OBSTACLE_Y,
    top: OBSTACLE_Y + obstacle.height,
  };
}

export function isOverlapped(a: IHitBox, b: IHitBox): boolean {
  return a.right > b.left && a.left < b.right && a.top > b.bottom && a.bottom < b.top;
}

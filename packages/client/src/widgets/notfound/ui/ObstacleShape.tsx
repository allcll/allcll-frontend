import CactusClusterSvg from '@/assets/notfound/cactus-cluster.svg?react';
import CactusLargeSvg from '@/assets/notfound/cactus-large.svg?react';
import CactusSmallSvg from '@/assets/notfound/cactus-small.svg?react';
import type { ObstacleType } from '@/widgets/notfound/model/types.ts';

const OBSTACLE_SVGS: Record<ObstacleType, typeof CactusLargeSvg> = {
  'cactus-large': CactusLargeSvg,
  'cactus-small': CactusSmallSvg,
  'cactus-cluster': CactusClusterSvg,
};

interface IObstacleShapeProps {
  type: ObstacleType;
}

function ObstacleShape({ type }: Readonly<IObstacleShapeProps>) {
  const ObstacleSvg = OBSTACLE_SVGS[type];

  return <ObstacleSvg width="100%" height="100%" />;
}

export default ObstacleShape;

import CactusLargeSvg from '@/assets/notfound/cactus-large.svg?react';
import CactusSmallSvg from '@/assets/notfound/cactus-small.svg?react';
import CactusClusterSvg from '@/assets/notfound/cactus-cluster.svg?react';
import type { ObstacleType } from '@/pages/notfound/model/types';

const ObstacleShape = ({ type }: { type: ObstacleType }) => {
  if (type === 'cactus-large') return <CactusLargeSvg width="100%" height="100%" aria-hidden />;
  if (type === 'cactus-small') return <CactusSmallSvg width="100%" height="100%" aria-hidden />;
  return <CactusClusterSvg width="100%" height="100%" aria-hidden />;
};

export default ObstacleShape;

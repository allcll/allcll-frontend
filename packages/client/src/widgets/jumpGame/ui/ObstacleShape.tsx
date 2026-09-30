import type { SVGProps } from 'react';
import type { ObstacleType } from '@/widgets/jumpGame/model/types.ts';

function CactusLarge(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width={40} height={40} fill="currentColor" {...props}>
      <rect x={16} y={4} width={8} height={36} />
      <rect x={8} y={10} width={4} height={12} />
      <rect x={8} y={18} width={8} height={4} />
      <rect x={28} y={14} width={4} height={12} />
      <rect x={24} y={22} width={8} height={4} />
    </svg>
  );
}

function CactusSmall(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width={32} height={40} fill="currentColor" {...props}>
      <rect x={13} y={2} width={6} height={38} />
      <rect x={6} y={14} width={3} height={10} />
      <rect x={6} y={20} width={7} height={4} />
    </svg>
  );
}

function CactusCluster(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 28" width={50} height={28} fill="currentColor" {...props}>
      <rect x={2} y={8} width={5} height={20} />
      <rect x={11} y={2} width={5} height={26} />
      <rect x={20} y={6} width={5} height={22} />
      <rect x={29} y={0} width={5} height={28} />
      <rect x={38} y={10} width={5} height={18} />
    </svg>
  );
}

const OBSTACLE_SHAPES: Record<ObstacleType, typeof CactusLarge> = {
  'cactus-large': CactusLarge,
  'cactus-small': CactusSmall,
  'cactus-cluster': CactusCluster,
};

interface IObstacleShapeProps {
  type: ObstacleType;
}

function ObstacleShape({ type }: Readonly<IObstacleShapeProps>) {
  const Shape = OBSTACLE_SHAPES[type];

  return <Shape width="100%" height="100%" />;
}

export default ObstacleShape;

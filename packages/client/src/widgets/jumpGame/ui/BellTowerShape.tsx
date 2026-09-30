import type { SVGProps } from 'react';

/** 창과 입구는 스테이지 배경색으로 칠해 뚫린 것처럼 보이게 합니다 */
const OPENING_COLOR = '#f9fafb';

function BellTowerShape(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 112"
      width={48}
      height={112}
      shapeRendering="crispEdges"
      fill="currentColor"
      {...props}
    >
      <rect x={22} y={0} width={4} height={4} />
      <rect x={18} y={4} width={12} height={4} />
      <rect x={14} y={8} width={20} height={4} />
      <rect x={12} y={12} width={24} height={4} />
      <rect x={14} y={16} width={20} height={8} />
      <rect x={22} y={18} width={4} height={4} fill={OPENING_COLOR} />
      <rect x={14} y={24} width={20} height={16} />
      <rect x={16} y={28} width={4} height={10} fill={OPENING_COLOR} />
      <rect x={17} y={27} width={2} height={1} fill={OPENING_COLOR} />
      <rect x={22} y={28} width={4} height={10} fill={OPENING_COLOR} />
      <rect x={23} y={27} width={2} height={1} fill={OPENING_COLOR} />
      <rect x={28} y={28} width={4} height={10} fill={OPENING_COLOR} />
      <rect x={29} y={27} width={2} height={1} fill={OPENING_COLOR} />
      <rect x={12} y={40} width={24} height={3} />
      <rect x={16} y={43} width={16} height={57} />
      <rect x={22} y={52} width={4} height={6} fill={OPENING_COLOR} />
      <rect x={14} y={100} width={7} height={12} />
      <rect x={27} y={100} width={7} height={12} />
    </svg>
  );
}

export default BellTowerShape;

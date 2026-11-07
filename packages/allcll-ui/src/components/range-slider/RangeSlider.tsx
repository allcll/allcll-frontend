import { useRef } from 'react';
import * as RadixSlider from '@radix-ui/react-slider';

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  onValueCommit?: (value: [number, number]) => void;
  thumbLabels?: [string, string];
  className?: string;
}

function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onValueChange,
  onValueCommit,
  thumbLabels = ['최솟값', '최댓값'],
  className = '',
}: RangeSliderProps) {
  // 포인터로 끌다 마지막 이동이 렌더되기 전에 손을 떼면 Radix가 이전 값으로 확정하거나 확정을 건너뛰어, 끄는 동안 받은 마지막 값으로 확정
  const isPointerDownRef = useRef(false);
  const dragValueRef = useRef<[number, number] | null>(null);

  const commit = (next?: number[]) => {
    const committed = isPointerDownRef.current ? (dragValueRef.current ?? next) : next;
    isPointerDownRef.current = false;
    dragValueRef.current = null;
    if (committed) onValueCommit?.(committed as [number, number]);
  };

  return (
    <RadixSlider.Root
      min={min}
      max={max}
      step={step}
      value={value}
      minStepsBetweenThumbs={0}
      onPointerDown={() => {
        isPointerDownRef.current = true;
      }}
      onValueChange={next => {
        if (isPointerDownRef.current) dragValueRef.current = next as [number, number];
        onValueChange(next as [number, number]);
      }}
      onValueCommit={commit}
      onLostPointerCapture={() => isPointerDownRef.current && commit()}
      // 바텀시트 안에서 좌우로 끌 때 시트까지 끌리지 않도록 함
      data-vaul-no-drag
      className={`relative flex items-center w-full h-5 touch-none select-none ${className}`}
    >
      <RadixSlider.Track className="relative grow h-1.5 rounded-full bg-gray-200">
        <RadixSlider.Range className="absolute h-full rounded-full bg-primary-500" />
      </RadixSlider.Track>
      {thumbLabels.map(label => (
        <RadixSlider.Thumb
          key={label}
          aria-label={label}
          className="block w-5 h-5 rounded-full bg-white border-2 border-primary-500 shadow-sm cursor-grab outline-none focus-visible:ring-2 focus-visible:ring-primary-300 active:cursor-grabbing"
        />
      ))}
    </RadixSlider.Root>
  );
}

export default RangeSlider;

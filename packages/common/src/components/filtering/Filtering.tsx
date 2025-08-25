import React, { useRef } from 'react';
import FilterOption from './FilterOption';
import Chip from '../chip/Chip';
import useDetectClose from '../../hooks/useDetectClose';

interface IFiltering {
  label: string;
  children: React.ReactNode;
  className?: string;
  selected: boolean;
}

/**
 * 기본 필터링 컴포넌트 입니다.
 * Chip + 필터링할 수 있는 옵션들로 이루어진 컴포넌트입니다.
 * @param param0
 * @returns
 */
function Filtering({ label, selected, children, className = '' }: Readonly<IFiltering>) {
  const containerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [isChipOpen, setIsChipOpen] = useDetectClose({
    elem: contentRef,
    tabRefs: containerRef,
    initialState: false,
  });

  const handleClickChip = () => {
    setIsChipOpen(!isChipOpen);
  };

  return (
    <div className="relative inline-block">
      <Chip
        isChipOpen={isChipOpen}
        label={label}
        containerRef={containerRef}
        chipType="select"
        selected={selected}
        onClick={handleClickChip}
      />
      <FilterOption isChipOpen={isChipOpen} contentRef={contentRef} className={className}>
        {children}
      </FilterOption>
    </div>
  );
}

export default Filtering;

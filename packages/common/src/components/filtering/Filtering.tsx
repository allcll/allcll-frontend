import React, { useRef } from 'react';
import FilterOption from './FilterOption';
import useDetectClose from '@/hooks/useDetectClose';
import Chip from '../chip/Chip';

interface IFiltering {
  label: string;
  children: React.ReactNode;
  className?: string;
  selected: boolean;
}

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
      <Chip label={label} containerRef={containerRef} chipType="select" selected={selected} onClick={handleClickChip} />
      {isChipOpen && (
        <FilterOption contentRef={contentRef} className={className}>
          {children}
        </FilterOption>
      )}
    </div>
  );
}

export default Filtering;

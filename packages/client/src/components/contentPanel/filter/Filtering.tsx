import { useRef } from 'react';
import FilterOption from './FilterOption';
import Chip from '@/components/common/Chip';
import useDetectClose from '@/hooks/useDetectClose';

interface IFiltering {
  label: string;
  children: React.ReactNode;
  className?: string;
}

function Filtering({ label, children, className = '' }: Readonly<IFiltering>) {
  const containerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [isChipOpen, setIsChipOpen] = useDetectClose({
    elem: contentRef,
    tabRefs: containerRef,
    initialState: false,
  });

  return (
    <div className="relative inline-block">
      <Chip
        label={label}
        containerRef={containerRef}
        chipType="select"
        selected={label !== '학과' && label !== '요일' && label !== '학년'}
        onClick={() => setIsChipOpen(!isChipOpen)}
      />
      {isChipOpen && (
        <FilterOption contentRef={contentRef} className={className}>
          {children}
        </FilterOption>
      )}
    </div>
  );
}

export default Filtering;

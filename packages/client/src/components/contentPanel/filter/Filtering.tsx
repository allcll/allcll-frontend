import FilterOption from './FilterOption';
import Chip from '@/components/common/Chip';

interface IFiltering {
  label: string;
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onToggle: (label: string) => void;
}

function Filtering({ label, children, className = '', isOpen, onToggle }: IFiltering) {
  return (
    <div className="relative inline-block">
      <Chip label={label} chipType="select" selected={isOpen} onClick={() => onToggle(label)} />
      {isOpen && <FilterOption className={className}>{children}</FilterOption>}
    </div>
  );
}

export default Filtering;

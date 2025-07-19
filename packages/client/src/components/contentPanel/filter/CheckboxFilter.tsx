import Filtering from './Filtering';
import Checkbox from '@/components/common/Checkbox';

interface ICheckboxFilter<T extends string | number> {
  labelPrefix: string;
  openFilter: '학과' | '학년' | '요일' | null;
  toggleFilter: () => void;
  selectedItems: T[];
  setSelectedItems: React.Dispatch<React.SetStateAction<T[]>>;
  options: T[];
}

function CheckboxFilter<T extends string | number>({
  labelPrefix,
  openFilter,
  toggleFilter,
  selectedItems,
  setSelectedItems,
  options,
}: ICheckboxFilter<T>) {
  const checkSelected = (item: T) => selectedItems.includes(item);

  const handleChange = (item: T) => {
    setSelectedItems(prev => (prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]));
  };

  const label =
    selectedItems.length === 0
      ? `${labelPrefix}`
      : selectedItems.length > 1
        ? `${selectedItems[0]}${labelPrefix} 외 ${selectedItems.length - 1}개`
        : `${selectedItems[0]}${labelPrefix}`;

  return (
    <Filtering label={label} isOpen={openFilter === labelPrefix} onToggle={toggleFilter}>
      {options.map(item => (
        <Checkbox
          key={item}
          label={`${item}${labelPrefix}`}
          isChecked={checkSelected(item)}
          onChange={() => handleChange(item)}
        />
      ))}
    </Filtering>
  );
}

export default CheckboxFilter;

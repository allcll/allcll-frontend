import Filtering from './Filtering';
import Checkbox from '@/components/common/Checkbox';

interface ICheckboxFilter<T extends string | number> {
  labelPrefix: string;
  openFilter: boolean;
  toggleFilter: () => void;
  selectedItems: T[];
  handleChangeCheckbox: (item: T) => void;
  options: T[];
}

function CheckboxFilter<T extends string | number>({
  labelPrefix,
  openFilter,
  toggleFilter,
  selectedItems,
  handleChangeCheckbox,
  options,
}: ICheckboxFilter<T>) {
  const checkSelected = (item: T) => selectedItems.includes(item);

  const label =
    selectedItems.length === 0
      ? `${labelPrefix}`
      : selectedItems.length > 1
        ? `${selectedItems[0]}${labelPrefix} 외 ${selectedItems.length - 1}개`
        : `${selectedItems[0]}${labelPrefix}`;

  return (
    <Filtering label={label} isOpen={openFilter} onToggle={toggleFilter}>
      {options.map(item => (
        <Checkbox
          key={item}
          label={`${item}${labelPrefix}`}
          isChecked={checkSelected(item)}
          onChange={() => handleChangeCheckbox(item)}
        />
      ))}
    </Filtering>
  );
}

export default CheckboxFilter;

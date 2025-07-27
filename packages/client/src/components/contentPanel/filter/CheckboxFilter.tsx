import Filtering from './Filtering';
import Checkbox from '@/components/common/Checkbox';

interface ICheckboxFilter<T extends string | number> {
  labelPrefix: string;
  selectedItems: T[];
  handleChangeCheckbox: (item: T) => void;
  options: T[];
  selected: boolean;
}

function CheckboxFilter<T extends string | number>({
  labelPrefix,
  selectedItems,
  handleChangeCheckbox,
  options,
  selected,
}: ICheckboxFilter<T>) {
  const checkSelected = (item: T) => selectedItems.includes(item);

  const label =
    selectedItems.length === 0
      ? `${labelPrefix}`
      : selectedItems.length > 1
        ? `${selectedItems[0]}${labelPrefix} 외 ${selectedItems.length - 1}개`
        : `${selectedItems[0]}${labelPrefix}`;

  return (
    <Filtering label={label} selected={selected}>
      <>
        {options.map(item => (
          <Checkbox
            key={item}
            label={`${item}${labelPrefix}`}
            isChecked={checkSelected(item)}
            onChange={() => handleChangeCheckbox(item)}
          />
        ))}
      </>
    </Filtering>
  );
}

export default CheckboxFilter;

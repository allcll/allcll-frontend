import Checkbox from './Checkbox';
import Filtering from './Filtering';

export interface OptionType<LABEL extends string | number> {
  id: number;
  label: LABEL;
}

interface ICheckboxFilter<LABEL extends string | number> {
  labelPrefix: string;
  selectedItems: number[];
  handleChangeCheckbox: (item: number) => void;
  options: OptionType<LABEL>[];
  selected: boolean;
}

/**
 * 필터링 컴포넌트 중 체크 박스로 이루어진 컴포넌트입니다.
 */
function CheckboxFilter<LABEL extends string | number>({
  labelPrefix,
  selectedItems,
  handleChangeCheckbox,
  options,
  selected,
}: ICheckboxFilter<LABEL>) {
  const checkSelected = (item: number) => {
    return selectedItems.some(selected => selected === item);
  };

  const getItemLabel = (id: number) => {
    const option = options.find(opt => opt.id === id);
    if (!option) {
      return labelPrefix;
    }
    return option.id === 0 ? '전체' : `${option.label}${labelPrefix}`;
  };

  let label: string;

  if (selectedItems.length === 0) {
    label = labelPrefix;
  } else if (selectedItems.length > 1) {
    label = `${getItemLabel(selectedItems[0])} 외 ${selectedItems.length - 1}개`;
  } else {
    label = getItemLabel(selectedItems[0]);
  }

  return (
    <Filtering label={label} selected={selected}>
      {options.map(option => (
        <Checkbox
          key={option.id}
          label={getItemLabel(option.id)}
          checked={checkSelected(option.id)}
          onChange={() => handleChangeCheckbox(option.id)}
        />
      ))}
    </Filtering>
  );
}

export default CheckboxFilter;

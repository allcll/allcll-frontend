import Checkbox from './Checkbox';

type FilterItemProps<VALUE extends string | number> = {
  label: string;
  selected: boolean;
  onClick: () => void;
  value: VALUE;
};

function CheckboxAdapter<VALUE extends string | number>({ label, selected, onClick }: FilterItemProps<VALUE>) {
  return <Checkbox label={label} checked={selected} onChange={onClick} />;
}

export default CheckboxAdapter;

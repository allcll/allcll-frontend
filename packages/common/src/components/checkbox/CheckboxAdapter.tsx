import Checkbox from './Checkbox';

type FilterItemProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

function CheckboxAdapter({ label, selected, onClick }: FilterItemProps) {
  return <Checkbox label={label} checked={selected} onChange={onClick} />;
}

export default CheckboxAdapter;

import { Checkbox } from '@allcll/allcll-ui';

type FilterItemProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

function CheckboxAdapter({ label, selected, onClick }: FilterItemProps) {
  return <Checkbox label={label} checked={selected} onChange={onClick} />;
}

CheckboxAdapter.layout = 'flex' as const;

export default CheckboxAdapter;

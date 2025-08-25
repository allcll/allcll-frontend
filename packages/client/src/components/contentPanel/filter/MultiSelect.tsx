import Checkbox from '@common/components/filtering/Checkbox.tsx';

interface ISelectItem<T> {
  label: string;
  value: T;
}

interface IMultiSelect<T> {
  items: ISelectItem<T>[]; // 전체 아이템 목록
  selectedItems: T[];
  setSelectedItems: (values: T[]) => void;
  isLoading?: boolean;
}

/** Multi Select 를 위한 컴포넌트
 * 전체 선택기능 및 ... */
function MultiSelect<T>({ items, selectedItems, setSelectedItems, isLoading = false }: Readonly<IMultiSelect<T>>) {
  const isAllSelected = items.length > 0 && items.length === selectedItems.length;

  const handleAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(i => i.value));
    }
  };

  const handleItemChange = (value: T) => {
    if (selectedItems.includes(value)) {
      setSelectedItems(selectedItems.filter(item => item !== value));
    } else {
      setSelectedItems([...selectedItems, value]);
    }
  };

  if (isLoading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <>
      <Checkbox label="전체" checked={isAllSelected} onChange={handleAll} />

      {items.map((item, index) => (
        <Checkbox
          key={'checkbox-' + (item.value ?? index)}
          label={item.label}
          checked={selectedItems.includes(item.value)}
          onChange={() => handleItemChange(item.value)}
        />
      ))}
    </>
  );
}

export default MultiSelect;

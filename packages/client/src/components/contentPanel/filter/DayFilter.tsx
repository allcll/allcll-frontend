import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import { Day } from '@/utils/types';
import CheckboxFilter, { OptionType } from '@common/components/filtering/CheckboxFilter';

const DAYS: OptionType<Day | '전체'>[] = [
  { id: 0, label: '전체' },
  { id: 1, label: '월' },
  { id: 2, label: '화' },
  { id: 3, label: '수' },
  { id: 4, label: '목' },
  { id: 5, label: '금' },
];

function DayFilter() {
  const { selectedDays, setFilterSchedule } = useFilterScheduleStore();

  const findLabelById = (id: number) => DAYS.find(day => day.id === id)?.label ?? '전체';

  const selectedAll = () => {
    const checked = selectedDays.length === DAYS.length;

    setFilterSchedule('selectedDays', checked ? [] : DAYS.map(day => day.label));
  };

  const handleChangeCheckbox = (optionId: number) => {
    const optionLabel = findLabelById(optionId);

    if (optionId === 0) {
      selectedAll();
      return;
    }

    const isSelected = selectedDays.includes(optionLabel);

    if (isSelected) {
      setFilterSchedule(
        'selectedDays',
        selectedDays.filter(day => day !== optionLabel),
      );
      return;
    }

    if (!isSelected) {
      setFilterSchedule('selectedDays', [...selectedDays, optionLabel]);
    }
  };

  const selectedIds = DAYS.filter(option => selectedDays.includes(option.label)).map(option => option.id);

  return (
    <CheckboxFilter
      labelPrefix="요일"
      selectedItems={selectedIds}
      handleChangeCheckbox={handleChangeCheckbox}
      options={DAYS}
      selected={selectedDays.length !== 0}
    />
  );
}

export default DayFilter;

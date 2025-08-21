import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import CheckboxFilter, { OptionType } from '@common/components/filtering/CheckboxFilter';

const CREDITS: OptionType<number>[] = [
  { value: 1, label: '1학점' },
  { value: 2, label: '2학점' },
  { value: 3, label: '3학점' },
];

function CreditFilter() {
  const { selectedCredits, setFilterSchedule } = useFilterScheduleStore();

  const setFilterScheduleWrapper = (field: string, value: number[]) => {
    if (field === 'selectedCredits') {
      setFilterSchedule('selectedCredits', value);
    }
  };

  return (
    <CheckboxFilter
      labelPrefix="학점"
      selectedValues={selectedCredits}
      field="selectedCredits"
      setFilterSchedule={setFilterScheduleWrapper}
      options={CREDITS}
      selected={selectedCredits.length !== 0}
    />
  );
}

export default CreditFilter;

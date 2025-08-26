import useMobile from '@/hooks/useMobile';
import { useScheduleSearchStore } from '@/store/useFilterStore.ts';
import CheckboxAdapter from '@common/components/checkbox/CheckboxAdapter';
import Chip from '@common/components/chip/Chip';
import Filtering from '@common/components/filtering/Filtering';
import MultiSelectFilterOption, { OptionType } from '@common/components/filtering/MultiSelectFilterOption';

export const CREDITS: OptionType<number>[] = [
  { value: 1, label: '1학점' },
  { value: 2, label: '2학점' },
  { value: 3, label: '3학점' },
];

function CreditFilter() {
  const { credits } = useScheduleSearchStore(state => state.filters);
  const setFilters = useScheduleSearchStore(state => state.setFilter);
  const isMobile = useMobile();

  const setFilterScheduleWrapper = (field: string, value: number[]) => {
    if (field === 'selectedCredits') {
      setFilters('credits', value);
    }
  };

  const getLabelPrefix = () => {
    if (credits.length === 0) return '학점';
    if (credits.length === 1) return credits[0] + '학점';
    return credits[0] + '학점 외 ' + (credits.length - 1) + '개';
  };

  const labelPrefix = getLabelPrefix();

  return (
    <>
      {isMobile ? (
        <MultiSelectFilterOption
          labelPrefix="학점"
          selectedValues={credits}
          field="selectedCredits"
          setFilter={setFilterScheduleWrapper}
          options={CREDITS}
          ItemComponent={Chip}
          className="w-full flex flex-row gap-2"
        />
      ) : (
        <Filtering label={labelPrefix} selected={credits.length > 0}>
          <MultiSelectFilterOption
            labelPrefix="학점"
            selectedValues={credits}
            field="selectedCredits"
            setFilter={setFilterScheduleWrapper}
            options={CREDITS}
            ItemComponent={CheckboxAdapter}
          />
        </Filtering>
      )}
    </>
  );
}

export default CreditFilter;

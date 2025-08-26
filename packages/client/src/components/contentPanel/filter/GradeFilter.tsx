import useMobile from '@/hooks/useMobile';
import { useScheduleSearchStore } from '@/store/useFilterStore.ts';
import { Grade } from '@/utils/types';
import CheckboxAdapter from '@common/components/checkbox/CheckboxAdapter';
import Chip from '@common/components/chip/Chip';
import Filtering from '@common/components/filtering/Filtering';
import MultiSelectFilterOption, { OptionType } from '@common/components/filtering/MultiSelectFilterOption';

export const GRADE: OptionType<Grade>[] = [
  { value: 1, label: '1학년' },
  { value: 2, label: '2학년' },
  { value: 3, label: '3학년' },
  { value: 4, label: '4학년' },
];

function GradeFilter() {
  const { grades } = useScheduleSearchStore(state => state.filters);
  const setFilter = useScheduleSearchStore(state => state.setFilter);
  const isMobile = useMobile();

  const setFilterScheduleWrapper = (field: string, value: Grade[]) => {
    if (field === 'selectedGrades') {
      setFilter('grades', value);
    }
  };

  return (
    <>
      {isMobile ? (
        <MultiSelectFilterOption<Grade>
          labelPrefix="학년"
          selectedValues={grades}
          field="selectedGrades"
          setFilter={setFilterScheduleWrapper}
          options={GRADE}
          ItemComponent={Chip}
          className="w-full flex flex-row gap-2"
        />
      ) : (
        <Filtering label="학년" selected={grades.length > 0}>
          <MultiSelectFilterOption<Grade>
            labelPrefix="학년"
            selectedValues={grades}
            field="selectedGrades"
            setFilter={setFilterScheduleWrapper}
            options={GRADE}
            ItemComponent={CheckboxAdapter}
          />
        </Filtering>
      )}
    </>
  );
}

export default GradeFilter;

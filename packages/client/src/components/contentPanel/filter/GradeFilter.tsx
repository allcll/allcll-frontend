import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import { Grade } from '@/utils/types';
import CheckboxFilter, { OptionType } from '@common/components/filtering/CheckboxFilter';

const GRADE: OptionType<Grade | '전체'>[] = [
  { id: 0, label: '전체' },
  { id: 1, label: 1 },
  { id: 2, label: 2 },
  { id: 3, label: 3 },
  { id: 4, label: 4 },
];

function GradeFilter() {
  const { selectedGrades, setFilterSchedule } = useFilterScheduleStore();

  const findLabelById = (id: number) => GRADE.find(grade => grade.id === id)?.label ?? '전체';

  const selectedAll = () => {
    const checked = selectedGrades.length === GRADE.length;

    setFilterSchedule('selectedGrades', checked ? [] : GRADE.map(grade => grade.label));
    return;
  };

  const handleChangeCheckbox = (optionId: number) => {
    const optionLabel = findLabelById(optionId);

    if (optionId === 0) {
      selectedAll();
      return;
    }

    const isSelected = selectedGrades.includes(optionLabel);

    if (isSelected) {
      setFilterSchedule(
        'selectedGrades',
        selectedGrades.filter(grade => grade !== optionLabel),
      );
      return;
    }

    if (!isSelected) {
      setFilterSchedule('selectedGrades', [...selectedGrades, optionLabel]);
    }
  };

  const selectedIds = GRADE.filter(option => selectedGrades.includes(option.label)).map(option => option.id);

  return (
    <CheckboxFilter
      labelPrefix="학년"
      selectedItems={selectedIds}
      handleChangeCheckbox={handleChangeCheckbox}
      options={GRADE}
      selected={selectedGrades.length !== 0}
    />
  );
}

export default GradeFilter;

import CheckboxFilter from './CheckboxFilter';
import { Grade } from '@/utils/types';

const GRADE: Grade[] = [1, 2, 3, 4];

function GradeFilter(props: {
  openFilter: '학과' | '학년' | '요일' | null;
  toggleFilter: () => void;
  selectedGrades: Grade[];
  setSelectedGrades: React.Dispatch<React.SetStateAction<Grade[]>>;
}) {
  const { openFilter, toggleFilter, selectedGrades, setSelectedGrades } = props;

  return (
    <CheckboxFilter
      labelPrefix="학년"
      openFilter={openFilter}
      toggleFilter={toggleFilter}
      selectedItems={selectedGrades}
      setSelectedItems={setSelectedGrades}
      options={GRADE}
    />
  );
}

export default GradeFilter;

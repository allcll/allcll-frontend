import { filterDays, filterDepartment, filterGrades, filterSearchKeywords } from '@/utils/filtering/filterSubjects';
import { Day, Grade, Subject } from '@/utils/types';
import useSearchLogging from '@/hooks/useSearchLogging.ts';

interface IUseFilteringSubjects<T extends Subject> {
  subjects: T[];
  searchKeywords: string;
  selectedDays?: (Day | '전체')[];
  selectedGrades?: (Grade | '전체')[];
  isFavorite?: boolean;
  selectedDepartment: string;
  pickedFavorites?: (id: number) => boolean;
}

function useFilteringSubjects<T extends Subject>({
  subjects,
  searchKeywords,
  selectedDays,
  selectedDepartment,
  selectedGrades,
  isFavorite,
  pickedFavorites = () => false,
}: IUseFilteringSubjects<T>) {
  const { onSearchChange } = useSearchLogging();

  if (!subjects || subjects.length === 0) return [];

  onSearchChange(searchKeywords, selectedDepartment);

  return subjects.filter(subject => {
    const filteredByDepartment = filterDepartment(subject, selectedDepartment);
    const filteredByGrades = selectedGrades ? filterGrades(subject, selectedGrades) : true;
    const filteredByDays = selectedDays ? filterDays(subject, selectedDays) : true;
    const filteredBySearchKeywords = filterSearchKeywords(subject, searchKeywords);

    // Wishes의 isFavorite
    const filteredByIsFavorite = !isFavorite || (isFavorite && pickedFavorites(subject.subjectId));

    return (
      filteredByDepartment && filteredByGrades && filteredByDays && filteredBySearchKeywords && filteredByIsFavorite
    );

    // TODO: pin 필터링 로직 추가
  });
}

export default useFilteringSubjects;

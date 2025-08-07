import { filterDays, filterDepartment, filterGrades, filterSearchKeywords } from '@/utils/filtering/filterSubjects';
import { Day, Grade, Subject } from '@/utils/types';

interface IuseFilteringSubjects<T extends Subject> {
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
  pickedFavorites,
}: IuseFilteringSubjects<T>) {
  if (!subjects || subjects.length === 0) return [];

  return subjects.filter(subject => {
    const filteredByDepartment = filterDepartment(subject, selectedDepartment);
    const filteredByGrades = selectedGrades ? filterGrades(subject, selectedGrades) : true;
    const filteredByDays = selectedDays ? filterDays(subject, selectedDays) : true;
    const filteredBySearchKeywords = filterSearchKeywords(subject, searchKeywords);

    /**
     * Wishes의 isFavorite
     */
    const filteredByIsFavorite = isFavorite ? (pickedFavorites ? pickedFavorites(subject.subjectId) : false) : true;

    return (
      filteredByDepartment && filteredByGrades && filteredByDays && filteredBySearchKeywords && filteredByIsFavorite
    );

    // TODO: pin 필터링 로직 추가
  });
}

export default useFilteringSubjects;

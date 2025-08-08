import { filterDays, filterDepartment, filterGrades, filterSearchKeywords } from '@/utils/filtering/filterSubjects';
import { Day, Grade, Subject } from '@/utils/types';
import useSearchLogging from '@/hooks/useSearchLogging.ts';
import { usePinned } from '@/store/usePinned.ts';

interface IUseFilteringSubjects<T extends Subject> {
  subjects: T[];
  searchKeywords: string;
  selectedDays?: (Day | '전체')[];
  selectedGrades?: (Grade | '전체')[];
  isFavorite?: boolean;
  isPinned?: boolean;
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
  isPinned,
  pickedFavorites = () => false,
}: IUseFilteringSubjects<T>) {
  const { onSearchChange } = useSearchLogging();
  const { data: pinnedSubjects } = usePinned();

  if (!subjects || subjects.length === 0) return [];

  onSearchChange(searchKeywords, selectedDepartment);

  const matchesPinned = (id: number) => pinnedSubjects?.some(({ subjectId }) => subjectId === id);

  return subjects.filter(subject => {
    const filteredByDepartment = filterDepartment(subject, selectedDepartment);
    const filteredByGrades = selectedGrades ? filterGrades(subject, selectedGrades) : true;
    const filteredByDays = selectedDays ? filterDays(subject, selectedDays) : true;
    const filteredBySearchKeywords = filterSearchKeywords(subject, searchKeywords);

    // Wishes의 isFavorite
    const filteredByIsFavorite = !isFavorite || pickedFavorites(subject.subjectId);
    const filteredByIsPinned = !isPinned || matchesPinned(subject.subjectId);

    return (
      filteredByDepartment &&
      filteredByGrades &&
      filteredByDays &&
      filteredBySearchKeywords &&
      filteredByIsFavorite &&
      filteredByIsPinned
    );

    // TODO: pin 필터링 로직 추가
  });
}

export default useFilteringSubjects;

import {
  filterCategories,
  filterClassroom,
  filterCredits,
  filterDepartment,
  filterGrades,
  filterLanguage,
  filterRemark,
  filterSchedule,
  filterSearchKeywords,
  filterSeatRange,
  filterWishRange,
  getNormalizedKeyword,
} from '@/utils/filtering/filterSubjects';
import useSearchLogging from '@/hooks/useSearchLogging.ts';
import { usePinned } from '@/hooks/server/usePinned.ts';
import { IPreRealSeat } from '@/hooks/server/usePreRealSeats.ts';
import useFavorites from '@/store/useFavorites.ts';
import { Filters } from '@/store/useFilterStore.ts';
import { Subject } from '@/utils/types';

// todo: filtering 활성화 된 것만 필터링하도록 설정 (default 아닌 경우만 필터링)
function useFilteringSubjects<T extends Subject>(subjects: T[], filters: Filters) {
  const { onSearchChange } = useSearchLogging();
  const { data: pinnedSubjects } = usePinned();
  const pickedFavorites = useFavorites(state => state.isFavorite);
  const {
    keywords,
    department,
    grades,
    credits,
    categories,
    seatRange,
    wishRange,
    time,
    classroom,
    note,
    language,
    alarmOnly,
    favoriteOnly,
  } = filters;

  if (!subjects || subjects.length === 0) return [];

  onSearchChange(keywords, department);

  const matchesPinned = (id: number) => pinnedSubjects?.some(({ subjectId }) => subjectId === id);

  const cleanedKeyword = getNormalizedKeyword(keywords);
  const keywordForCode = keywords.replace(/[-\s]/g, '').toLowerCase();
  console.log('filters', filters);

  return subjects.filter(subject => {
    const filteredBySearchKeywords = filterSearchKeywords(subject, cleanedKeyword, keywordForCode);
    const filteredByDepartment = filterDepartment(subject, department);
    const filteredByGrades = grades ? filterGrades(subject, grades) : true;
    const filteredByCredits = credits ? filterCredits(subject, credits) : true;
    const filteredByCategories = categories ? filterCategories(subject, categories) : true;
    const filteredBySeatRange =
      seatRange && 'seat' in subject ? filterSeatRange(subject as IPreRealSeat, seatRange) : true;
    const filteredByWishRange = wishRange ? filterWishRange(subject, wishRange) : true;
    const filteredByTime = time ? filterSchedule(subject, time) : true;
    const filteredByClassroom = filterClassroom(subject, classroom);
    const filteredByNote = note ? filterRemark(subject, note) : true;
    const filteredByLanguage = language ? filterLanguage(subject, language) : true;

    // Wishes의 isFavorite
    const filteredByIsFavorite = !favoriteOnly || pickedFavorites(subject.subjectId);
    const filteredByIsPinned = !alarmOnly || matchesPinned(subject.subjectId);

    return (
      filteredBySearchKeywords &&
      filteredByDepartment &&
      filteredByGrades &&
      filteredByCredits &&
      filteredByCategories &&
      filteredBySeatRange &&
      filteredByWishRange &&
      filteredByTime &&
      filteredByClassroom &&
      filteredByNote &&
      filteredByLanguage &&
      filteredByIsFavorite &&
      filteredByIsPinned
    );
  });
}

export default useFilteringSubjects;

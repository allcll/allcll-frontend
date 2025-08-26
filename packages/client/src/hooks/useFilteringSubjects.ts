import useSearchLogging from '@/hooks/useSearchLogging.ts';
import { usePinned } from '@/hooks/server/usePinned.ts';
import useFavorites from '@/store/useFavorites.ts';
import { Filters } from '@/store/useFilterStore.ts';
import { filterSearchKeywords, getFilteringFunctions, getNormalizedKeyword } from '@/utils/filtering/filterSubjects';
import { Subject } from '@/utils/types';

function useFilteringSubjects<T extends Subject>(subjects: T[], filters: Filters) {
  const { onSearchChange } = useSearchLogging();
  const { data: pinnedSubjects } = usePinned();
  const pickedFavorites = useFavorites(state => state.isFavorite);
  const { keywords, department, alarmOnly, favoriteOnly } = filters;

  if (!subjects || subjects.length === 0) return [];

  onSearchChange(keywords, department);

  const filterFunctions = getFilteringFunctions(filters);
  const matchesPinned = (id: number) => pinnedSubjects?.some(({ subjectId }) => subjectId === id);

  const cleanedKeyword = getNormalizedKeyword(keywords);
  const keywordForCode = keywords.replace(/[-\s]/g, '').toLowerCase();

  return subjects.filter(subject => {
    const filteredBySearchKeywords = filterSearchKeywords(subject, cleanedKeyword, keywordForCode);
    const otherFilters = filterFunctions(subject, filters);

    // Wishes의 isFavorite
    const filteredByIsFavorite = !favoriteOnly || pickedFavorites(subject.subjectId);
    const filteredByIsPinned = !alarmOnly || matchesPinned(subject.subjectId);

    return filteredBySearchKeywords && filteredByIsFavorite && filteredByIsPinned && otherFilters;
  });
}

export default useFilteringSubjects;

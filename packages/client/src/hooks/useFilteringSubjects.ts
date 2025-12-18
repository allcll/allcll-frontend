import useSearchLogging from '@/hooks/useSearchLogging.ts';
import { Filters } from '@/shared/model/useFilterStore.ts';
import { useFilterFunctions } from '@/utils/filtering/filterSubjects';
import { Subject } from '@/utils/types';

function useFilteringSubjects<T extends Subject>(subjects: T[], filters: Filters) {
  const filterFunctions = useFilterFunctions(filters);
  const { onSearchChange } = useSearchLogging();
  const { keywords, department } = filters;

  if (!subjects || subjects.length === 0) return [];

  onSearchChange(keywords, department);

  return subjects.filter(subject => filterFunctions(subject, filters));
}

export default useFilteringSubjects;

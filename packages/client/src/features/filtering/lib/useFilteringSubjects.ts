import useSearchLogging from '@/features/filtering/lib/useSearchLogging.ts';
import { Filters } from '@/shared/model/useFilterStore.ts';
import { useFilterFunctions } from '@/features/filtering/lib/filterSubjects.ts';
import { Subject } from '@/shared/model/types.ts';

function useFilteringSubjects<T extends Subject>(subjects: T[], filters: Filters) {
  const filterFunctions = useFilterFunctions(filters);
  const { onSearchChange } = useSearchLogging();
  const { keywords, department } = filters;

  if (!subjects || subjects.length === 0) return [];

  onSearchChange(keywords, department);

  return subjects.filter(subject => filterFunctions(subject, filters));
}

export default useFilteringSubjects;

import useSearchLogging from '@/features/filtering/lib/useSearchLogging.ts';
import { Filters } from '@/features/filtering/model/useFilterStore.ts';
import { useFilterFunctions } from '@/features/filtering/lib/filterSubjects.ts';
import { Subject, Wishes } from '@/shared/model/types.ts';
import { useEnhancedSearch } from './useEnhancedSearch';

function useFilteringSubjects<T extends Subject & Wishes>(subjects: T[] | undefined, filters: Filters) {
  const filterFunctions = useFilterFunctions(filters);
  const { onSearchChange } = useSearchLogging();
  const { keywords, department } = filters;

  // 1. 기본 필터 적용 (키워드/학과 제외한 나머지 필터들)
  // subjects가 없을 경우를 대비해 빈 배열로 필터링 진행
  const filtered = (subjects || []).filter(subject => filterFunctions(subject, filters));

  // 2. 검색 엔진 고도화 (Scoring & Ranking)
  // useEnhancedSearch는 내부에서 훅을 호출하므로 무조건 실행되어야 함
  const enhancedResults = useEnhancedSearch(filtered, keywords, department);

  // 로깅은 subjects가 있을 때만 의미가 있으므로 내부 로직에서 처리되거나 여기서 호출
  if (subjects && subjects.length > 0) {
    onSearchChange(keywords, department);
  }

  return enhancedResults;
}

export default useFilteringSubjects;

import { useMemo } from 'react';
import { disassemble } from 'es-hangul';
import { Subject, Wishes } from '@/shared/model/types';
import { getNormalizedKeyword, normalize } from '@/shared/lib/search';
import { useSearchPopularity, useSearchQueryClicks } from '../api/useSearchEngineData';
import { getDepartmentRanks } from './useSearchRank';

interface ScoredSubject<T> {
  subject: T;
  score: number;
}

export function useEnhancedSearch<T extends Subject & Wishes>(
  subjects: T[] | undefined,
  query: string,
  deptCodeFilter?: string,
) {
  const { data: popularityMap, isLoading: isLoadingPop } = useSearchPopularity();
  const { data: queryClickMap, isLoading: isLoadingClicks } = useSearchQueryClicks();

  const dprtRankMap = useMemo(() => {
    const dprtRank = getDepartmentRanks();
    return new Map(dprtRank.map(([code, _], i) => [code, i]));
  }, []);

  const scoredSubjects = useMemo(() => {
    if (!subjects || subjects.length === 0) return [];
    
    // 데이터 로딩 중이면 원본 subjects 혹은 필터링된 기본 결과 반환 (랭킹만 미적용)
    if (isLoadingPop || isLoadingClicks) {
        if (!query && !deptCodeFilter) return subjects.slice(0, 100);
        
        // 기본 필터링만 적용하여 반환
        return subjects
            .filter(s => {
                if (deptCodeFilter && deptCodeFilter !== '' && s.deptCd !== deptCodeFilter) return false;
                return true;
            })
            .slice(0, 100);
    }

    if (!query && !deptCodeFilter) return subjects.slice(0, 100);

    const trimmedQuery = (query || '').trim();
    const normQuery = normalize(trimmedQuery);
    const disQuery = getNormalizedKeyword(trimmedQuery);
    const keywordForCode = trimmedQuery.replace(/[-\s]/g, '').toLowerCase();

    return subjects
      .map((subject): ScoredSubject<T> | null => {
        let score = 0;

        // --- 필터링 (Hard Filters) ---
        if (deptCodeFilter && deptCodeFilter !== '' && subject.deptCd !== deptCodeFilter) {
          return null;
        }

        // --- 1. 텍스트 유사도 점수 (Text Similarity) ---
        if (trimmedQuery) {
          const fields = [
            { val: subject.subjectName, weight: 10 },
            { val: subject.professorName || '', weight: 5 },
            { val: subject.subjectCode, weight: 8 },
          ];

          fields.forEach(field => {
            const normVal = normalize(field.val);
            const disVal = disassemble(normVal).toLowerCase();

            if (normVal === normQuery) score += field.weight * 50; // 완전 일치
            else if (normVal.startsWith(normQuery)) score += field.weight * 30; // 전방 일치
            else if (normVal.includes(normQuery)) score += field.weight * 20; // 부분 포함
            else if (disVal.includes(disQuery)) score += field.weight * 10; // 자모 매칭 (Fuzzy)
          });

          // 학수번호 + 분반 코드 매칭 (특별 가중치)
          const fullCode = (subject.subjectCode + subject.classCode).toLowerCase();
          if (fullCode.includes(keywordForCode)) score += 40;

          // --- 4. 검색어 기반 클릭률 (Query-specific CTR) ---
          if (queryClickMap) {
            // 원본 쿼리와 트림된 쿼리 모두 시도
            const queryClicks = queryClickMap[trimmedQuery] || queryClickMap[query] || {};
            const clickCount = queryClicks[subject.subjectId] || 0;
            score += clickCount * 100;
          }
        } else {
            // 쿼리가 없는 경우 (학과 필터만 있는 경우 등) 기본 점수 부여하여 필터링 유지
            score = 1;
        }

        // --- 2. 학과 선호도 점수 (Department Preference) ---
        const deptCode = String(subject.deptCd || subject.departmentCode || '');
        const dprtRankIndex = dprtRankMap.get(deptCode);
        const dprtRankValue = dprtRankIndex === undefined ? 5 : dprtRankIndex;
        score += Math.max(0, (5 - dprtRankValue)) * 50;

        // --- 3. 글로벌 인기도 점수 (Global Popularity) ---
        // Fetch한 popularityMap 혹은 subject 자체의 totalCount 활용
        const pop = popularityMap?.[subject.subjectId] || subject.totalCount || 0;
        score += Math.log1p(pop) * 20;

        // --- 5. 동점 방지 (Tie breaker) ---
        score -= (Number(subject.classCode) || 0) * 0.01;

        return { subject, score };
      })
      .filter((item): item is ScoredSubject<T> => item !== null && item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.subject);
  }, [
    subjects,
    query,
    deptCodeFilter,
    popularityMap,
    queryClickMap,
    dprtRankMap,
    isLoadingPop,
    isLoadingClicks,
  ]);

  return scoredSubjects;
}

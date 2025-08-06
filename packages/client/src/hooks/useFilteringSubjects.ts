import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import { filterDays, filterDepartment, filterGrades, filterSearchKeywords } from '@/utils/filtering/filterSubjects';
import { SubjectApiResponse } from '@/utils/types';

function useFilteringSubjects(subjects: SubjectApiResponse[], searchKeywords: string) {
  const { selectedDays, selectedDepartment, selectedGrades } = useFilterScheduleStore();

  const filteredSubjects = subjects.filter(subject => {
    const filteredByDepartment = filterDepartment(subject, selectedDepartment);
    const filteredByGrades = filterGrades(subject, selectedGrades);
    const filteredByDays = filterDays(subject, selectedDays);
    const filteredBySearchKeywords = filterSearchKeywords(subject, searchKeywords);

    return filteredByDepartment && filteredByGrades && filteredByDays && filteredBySearchKeywords;
  });

  return filteredSubjects;
}

export default useFilteringSubjects;

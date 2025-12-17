import { disassemble } from 'es-hangul';
import { Day, Grade, RangeFilter, RangeMinMaxFilter, RemarkType, Subject, Wishes } from '../types';
import { IPreRealSeat } from '@/hooks/server/usePreRealSeats.ts';
import { usePinned } from '@/hooks/server/usePinned.ts';
import useFavorites from '@/store/useFavorites.ts';
import { Filters, isFilterEmpty } from '@/store/useFilterStore.ts';
import { TimeslotAdapter } from '@/utils/timetable/adapter.ts';
import { Time } from '@/shared/lib/time.ts';
import { IDayTimeItem } from '@/features/filtering/ui/DayTimeFilter.tsx';

/** 활성화 된 필터만 실행하는 함수를 반환 (최적화) */
export function useFilterFunctions(filters: Filters) {
  const { data: pinnedSubjects } = usePinned();
  const pickedFavorites = useFavorites(state => state.isFavorite);
  const filteringFunctions = getFilteringFunctions(filters, pinnedSubjects, pickedFavorites);

  const keys = Object.keys(filters) as (keyof Filters)[];
  const active = keys.filter(key => !isFilterEmpty(key, filters[key]));

  return <T extends Subject>(subject: T, filters: Filters) => {
    return active.every(key => {
      const func = filteringFunctions[key];
      if (!func) return true;

      return func(subject, filters[key]!);
    });
  };
}

function getFilteringFunctions(
  filters: Filters,
  pinnedSubjects: { subjectId: number }[] | undefined,
  pickedFavorites: (id: number) => boolean,
): Record<keyof Filters, Function> {
  const matchesPinned = (id: number) => pinnedSubjects?.some(({ subjectId }) => subjectId === id) ?? true;

  const cleanedKeyword = getNormalizedKeyword(filters.keywords);
  const keywordForCode = filters.keywords.replace(/[-\s]/g, '').toLowerCase();

  return {
    keywords: (subject: Subject) => filterSearchKeywords(subject, cleanedKeyword, keywordForCode),
    department: filterDepartment,
    grades: filterGrades,
    credits: filterCredits,
    categories: filterCategories,
    seatRange: filterSeatRange,
    wishRange: filterWishRange,
    time: filterSchedule,
    days: filterDays,
    classroom: filterClassroom,
    note: filterRemark,
    language: filterLanguage,
    alarmOnly: (subject: Subject) => pickedFavorites(subject.subjectId),
    favoriteOnly: (subject: Subject) => matchesPinned(subject.subjectId),
  };
}

function filterMinmax(value: number, range: RangeMinMaxFilter | null) {
  if (!range) return true;

  const { min, max } = range;

  return (min === undefined || value >= min) && (max === undefined || value <= max);
}

function filterMatches<T>(value: T, matchList: T[]) {
  return !matchList.length || matchList.includes(value);
}

function getNormalizedKeyword(keyword: string) {
  const cleanSearchInput = keyword.replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
  return disassemble(cleanSearchInput).toLowerCase();
}

export function filterDays(subject: Wishes | Subject, selectedDays: Day[]) {
  if (!subject.lesnTime || !selectedDays || selectedDays.length === 0) {
    return true;
  }

  const timeMatchResult = RegExp(/^([가-힣]+)/).exec(subject.lesnTime);

  if (!timeMatchResult) {
    return true;
  }

  const lessonDays = timeMatchResult[1].split('');
  return selectedDays.some(selectedDay => lessonDays.includes(selectedDay));
}

function filterGrades(subject: Wishes | Subject, selectedGrades: (Grade | '전체')[]) {
  const subjectGrade = Number(subject.studentYear);

  if (!subjectGrade) {
    return true;
  }

  if (selectedGrades.includes('전체') || selectedGrades.length === 0) {
    return true;
  }

  return selectedGrades.includes(subjectGrade as Grade);
}

function filterCredits(subject: Wishes | Subject, selectedCredits: number[]) {
  const credit = Number(subject.tmNum.split('/')[0]);
  if (!credit || isNaN(credit)) return true;

  return filterMatches(credit, selectedCredits);
}

function filterSeatRange<T extends Subject>(subject: T, seatRange: RangeFilter | RangeMinMaxFilter | null) {
  const s = subject as T & IPreRealSeat;
  if (!('seat' in s)) return true;

  return filterMinmax(s.seat ?? 0, seatRange as RangeMinMaxFilter);
}

function filterWishRange(subject: Wishes | Subject, wishRange: RangeFilter | RangeMinMaxFilter | null) {
  if (!('totalCount' in subject)) return true;
  return filterMinmax(subject.totalCount ?? 0, wishRange as RangeMinMaxFilter);
}

function filterDepartment(subject: Wishes | Subject, selectedDepartment: string) {
  return !selectedDepartment || selectedDepartment === '' || selectedDepartment === subject.deptCd;
}

function filterSearchKeywords(subject: Wishes | Subject, cleanedKeyword: string, keywordForCode: string) {
  if (!cleanedKeyword) return true;

  const disassembledProfessorName = subject.professorName ? disassemble(subject.professorName).toLowerCase() : '';
  const disassembledSubjectName = getNormalizedKeyword(subject.subjectName);

  const addSubjectAndClassCode = subject.subjectCode + subject.classCode;
  const filteredBySubjectAndClassCode = addSubjectAndClassCode.toLowerCase().includes(keywordForCode);

  return (
    disassembledProfessorName.includes(cleanedKeyword) ||
    disassembledSubjectName.includes(cleanedKeyword) ||
    filteredBySubjectAndClassCode
  );
}

function filterClassroom(subject: Wishes | Subject, selectedClassrooms: string[]) {
  if (!selectedClassrooms.length) return true;

  if (!subject.lesnRoom) return false;

  return selectedClassrooms.some(room => {
    const roomRegex = new RegExp(`^${room}[\\w]`, 'i');
    return roomRegex.test(subject.lesnRoom);
  });
}

function filterRemark(subject: Wishes | Subject, selectedNotes: RemarkType[]) {
  if (!selectedNotes || selectedNotes.length === 0) {
    return true;
  }

  return selectedNotes.some(note => {
    switch (note) {
      case '외국인대상':
        return subject.remark?.includes('외국인') ?? false;
      case 'SHP대상':
        return ['SHP', 'Honor'].some(k => subject.remark?.includes(k) ?? false);
      case '기타':
        return !subject.remark || !['외국인', 'SHP', 'Honor'].some(k => subject.remark?.includes(k) ?? false);
    }
  });
}

function filterSchedule(subject: Wishes | Subject, selectedTime: IDayTimeItem[]) {
  if (!selectedTime || selectedTime.length === 0 || !subject.lesnTime) {
    return true;
  }

  const time = new TimeslotAdapter(subject.lesnTime).toApiData();
  const schedule = time.map(t => ({
    day: t.dayOfWeeks,
    start: new Time(t.startTime),
    end: new Time(t.endTime),
  }));

  return selectedTime.some(item => {
    if (item.day === '') return true;

    const matchedSchedule = schedule.filter(t => t.day === item.day);
    if (item.type === 'all' || !matchedSchedule.length) return !!matchedSchedule.length;

    if (item.type === 'before' && item.start) {
      const threshold = new Time(item.start);
      return matchedSchedule.some(s => s.end.compare(threshold) <= 0);
    }

    if (item.type === 'after' && item.start) {
      const threshold = new Time(item.start);
      return matchedSchedule.some(s => threshold.compare(s.start) <= 0);
    }

    if (item.type === 'between' && item.start && item.end) {
      const startTime = new Time(item.start);
      const endTime = new Time(item.end);
      return matchedSchedule.some(s => startTime.compare(s.start) <= 0 && s.end.compare(endTime) <= 0);
    }
  });
}

function filterCategories(subject: Wishes | Subject, selectedCategories: string[]) {
  return filterMatches(subject.curiTypeCdNm, selectedCategories);
}

function filterLanguage(subject: Wishes | Subject, selectedLanguages: string[]) {
  return filterMatches(subject.curiLangNm ?? '', selectedLanguages);
}

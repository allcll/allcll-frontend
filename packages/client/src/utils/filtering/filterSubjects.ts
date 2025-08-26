import { disassemble } from 'es-hangul';
import { Grade, RangeFilter, RemarkType, Subject, Wishes } from '../types';
import { IDayTimeItem } from '@/components/contentPanel/filter/DayTimeFilter.tsx';
import { IPreRealSeat } from '@/hooks/server/usePreRealSeats.ts';
import { TimeslotAdapter } from '@/utils/timetable/adapter.ts';
import { Time } from '@/utils/time.ts';

function filterRange(value: number, range: RangeFilter | null) {
  if (!range) return true;

  return (
    (range.operator === 'over-equal' && value >= range.value) ||
    (range.operator === 'under-equal' && value <= range.value)
  );
}

function filterMatches<T>(value: T, matchList: T[]) {
  return !matchList.length || matchList.includes(value);
}

export function getNormalizedKeyword(keyword: string) {
  const cleanSearchInput = keyword.replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
  return disassemble(cleanSearchInput).toLowerCase();
}

// export function filterDays(subject: Wishes | Subject, selectedDays: (Day | '전체')[]) {
//   if (!subject.lesnTime) {
//     return true;
//   }
//
//   const timeMatchResult = RegExp(/^([가-힣]+)/).exec(subject.lesnTime);
//
//   if (!timeMatchResult) {
//     return false;
//   }
//
//   if (selectedDays.includes('전체') || selectedDays.length === 0) {
//     return true;
//   }
//
//   const lessonDays = timeMatchResult[1].split('');
//   return selectedDays.some(selectedDay => lessonDays.includes(selectedDay));
// }

export function filterGrades(subject: Wishes | Subject, selectedGrades: (Grade | '전체')[]) {
  const subjectGrade = Number(subject.studentYear);

  if (!subjectGrade) {
    return true;
  }

  if (selectedGrades.includes('전체') || selectedGrades.length === 0) {
    return true;
  }

  return selectedGrades.includes(subjectGrade as Grade);
}

export function filterCredits(subject: Wishes | Subject, selectedCredits: number[]) {
  const credit = Number(subject.tmNum.split('/')[0]);
  if (!credit || isNaN(credit)) return true;

  return filterMatches(credit, selectedCredits);
}

export function filterSeatRange(subject: IPreRealSeat, seatRange: RangeFilter | null) {
  if (!('seat' in subject)) return true;
  return filterRange(subject.seat ?? 0, seatRange);
}

export function filterWishRange(subject: Wishes | Subject, wishRange: RangeFilter | null) {
  if (!('totalCount' in subject)) return true;
  return filterRange(subject.totalCount ?? 0, wishRange);
}

export function filterDepartment(subject: Wishes | Subject, selectedDepartment: string) {
  return !selectedDepartment || selectedDepartment === '' || selectedDepartment === subject.deptCd;
}

export function filterSearchKeywords(subject: Wishes | Subject, cleanedKeyword: string, keywordForCode: string) {
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

export function filterClassroom(subject: Wishes | Subject, selectedClassrooms: string[]) {
  if (!selectedClassrooms.length) return true;

  if (!subject.lesnRoom) return false;

  return selectedClassrooms.some(room => {
    const roomRegex = new RegExp(`^${room}[\\w]`, 'i');
    return roomRegex.test(subject.lesnRoom);
  });
}

export function filterRemark(subject: Wishes | Subject, selectedNotes: RemarkType[]) {
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

export function filterSchedule(subject: Wishes | Subject, selectedTime: IDayTimeItem[]) {
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

export function filterCategories(subject: Wishes | Subject, selectedCategories: string[]) {
  return filterMatches(subject.curiTypeCdNm, selectedCategories);
}

export function filterLanguage(subject: Wishes | Subject, selectedLanguages: string[]) {
  return filterMatches(subject.curiLangNm ?? '', selectedLanguages);
}

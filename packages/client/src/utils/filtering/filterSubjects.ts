import { disassemble } from 'es-hangul';
import { Day, Grade, Subject, Wishes } from '../types';
import { IDayTimeItem } from '@/components/contentPanel/filter/DayTimeFilter.tsx';

export function filterDays(subject: Wishes | Subject, selectedDays: (Day | '전체')[]) {
  if (!subject.lesnTime) {
    return true;
  }

  const timeMatchResult = RegExp(/^([가-힣]+)/).exec(subject.lesnTime);

  if (!timeMatchResult) {
    return false;
  }

  if (selectedDays.includes('전체') || selectedDays.length === 0) {
    return true;
  }

  const lessonDays = timeMatchResult[1].split('');
  return selectedDays.some(selectedDay => lessonDays.includes(selectedDay));
}

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

export function filterDepartment(subject: Wishes | Subject, selectedDepartment: string) {
  return !selectedDepartment || selectedDepartment === '' || selectedDepartment === subject.deptCd;
}

export function filterSearchKeywords(subject: Wishes | Subject, cleanedKeyword: string, keywordForCode: string) {
  if (!cleanedKeyword) return true;

  const disassembledProfessorName = subject.professorName ? disassemble(subject.professorName).toLowerCase() : '';
  const cleanSubjectName = subject.subjectName.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '').replace(/\s+/g, '');
  const disassembledSubjectName = disassemble(cleanSubjectName).toLowerCase();

  const addSubjectAndClassCode = subject.subjectCode + subject.classCode;
  const filteredBySubjectAndClassCode = addSubjectAndClassCode.toLowerCase().includes(keywordForCode);

  return (
    disassembledProfessorName.includes(cleanedKeyword) ||
    disassembledSubjectName.includes(cleanedKeyword) ||
    filteredBySubjectAndClassCode
  );
}

export function filterClassroom(subject: Wishes | Subject, selectedClassrooms: string[]) {
  if (!subject.lesnRoom || selectedClassrooms.length === 0) {
    return false;
  }

  const abbreviatedRooms = selectedClassrooms.map(r => (r === '대양AI센터' ? '센' : r.slice(0, 1)));

  return abbreviatedRooms.some(room => {
    const roomRegex = new RegExp(`^${room}[\d\w]`, 'i');
    return roomRegex.test(subject.lesnRoom);
  });
}

export function filterRemark(subject: Wishes | Subject, selectedNotes: string[]) {
  if (!selectedNotes || selectedNotes.length === 0) {
    return false;
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

  return selectedTime.some(item => {
    if (item.day === '') return true;

    if (item.type === 'all') return subject.lesnTime.includes(item.day);

    const regex = new RegExp(`${item.day}(\\d{2}:\\d{2})`);
    const lessonTime = subject.lesnTime.match(regex);

    if (!lessonTime) return false;

    if (item.type === 'before' && item.start) {
      const start = item.start;
      return lessonTime.some(time => start.localeCompare(time) <= 0);
    }

    if (item.type === 'after' && item.start) {
      const start = item.start;
      return lessonTime.some(time => start.localeCompare(time) >= 0);
    }

    if (item.type === 'between' && item.start && item.end) {
      const { start, end } = item;
      return lessonTime.some(time => start.localeCompare(time) <= 0 && end.localeCompare(time) >= 0);
    }
  });
}

export function filterCategory(subject: Wishes | Subject, selectedCategories: string[]) {
  return !selectedCategories.length || selectedCategories.includes(subject.curiTypeCdNm);
}

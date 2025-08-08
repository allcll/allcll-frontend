import { disassemble } from 'es-hangul';
import { Day, Grade, Subject, Wishes } from '../types';

export function filterDays(subject: Wishes | Subject, selectedDays: (Day | '전체')[]) {
  if (!subject.lesnTime) {
    return false;
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
    return false;
  }

  if (selectedGrades.includes('전체') || selectedGrades.length === 0) {
    return true;
  }

  return selectedGrades.includes(subjectGrade as Grade);
}

export function filterDepartment(subject: Wishes | Subject, selectedDepartment: string) {
  return !selectedDepartment || selectedDepartment === '' || selectedDepartment === subject.deptCd;
}

export function filterSearchKeywords(subject: Wishes | Subject, searchKeywords: string) {
  if (!searchKeywords) {
    return true;
  }

  const cleanSearchInput = searchKeywords.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
  const disassembledSearchInput = disassemble(cleanSearchInput).toLowerCase();

  const disassembledProfessorName = subject.professorName ? disassemble(subject.professorName).toLowerCase() : '';
  const cleanSubjectName = subject.subjectName.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
  const disassembledSubjectName = disassemble(cleanSubjectName).toLowerCase();

  return (
    disassembledProfessorName.includes(disassembledSearchInput) ||
    disassembledSubjectName.includes(disassembledSearchInput)
  );
}

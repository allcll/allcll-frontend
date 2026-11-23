import { Subject } from '@/shared/model/types.ts';

/** subject의 표시 색상(배경색)을 반환합니다.
 * ex) 영어과목 - 초록색, 삭제된 과목 - 회색 */
export function getSubjectColorClass(data: Subject, hover = true) {
  const isEng = data.curiLangNm === '영어';
  const isDeleted = data.isDeleted;

  if (isDeleted) {
    return hover ? 'bg-surface-muted hover:bg-surface-strong' : 'bg-surface-muted';
  }

  if (isEng) {
    return hover ? 'bg-success-subtle hover:bg-success-muted' : 'bg-success-subtle';
  }

  return hover ? 'bg-surface hover:bg-surface-muted' : 'bg-surface';
}

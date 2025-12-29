import { Subject } from '@/utils/types.ts';

/** subject의 표시 색상(배경색)을 반환합니다.
 * ex) 영어과목 - 초록색, 삭제된 과목 - 회색 */
export function getSubjectColorClass(data: Subject, hover = true) {
  const isEng = data.curiLangNm === '영어';
  const isDeleted = data.isDeleted;

  if (isDeleted) {
    return hover ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-100';
  }

  if (isEng) {
    return hover ? 'bg-green-50 hover:bg-green-100' : 'bg-green-50';
  }

  return hover ? 'bg-white hover:bg-gray-100' : 'bg-white';
}

// 서버 날짜는 시간대 없이 KST로 오므로 그대로 자르고, 시간대가 붙은 값만 로컬 시간으로 바꿈
function toDateParts(value: string) {
  if (/[zZ]$|[+-]\d{2}:?\d{2}$/.test(value)) {
    const date = new Date(value);
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }

  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return { year, month, day };
}

/** 2026.11.03 */
export function formatDate(value: string) {
  if (!value) return '';
  const { year, month, day } = toDateParts(value);
  return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
}

/** 2026년 11월 3일 */
export function formatDateLong(value: string) {
  if (!value) return '';
  const { year, month, day } = toDateParts(value);
  return `${year}년 ${month}월 ${day}일`;
}

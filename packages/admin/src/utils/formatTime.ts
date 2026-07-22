export const formatTime = (dateString: string) => {
  if (!dateString) return '';

  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let hour = date.getHours();
  const minute = String(date.getMinutes()).padStart(2, '0');

  hour = hour % 12;
  hour = hour === 0 ? 12 : hour;

  return `${year}-${month}-${day}  ${String(hour).padStart(2, '0')}:${minute}`;
};

// 로컬 기준 YYYY-MM-DD로 변환 (toISOString은 UTC라 이른 시간대에 날짜가 하루 어긋남)
export const toDateString = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

// YYYY-MM-DD를 로컬 자정으로 파싱 (new Date('YYYY-MM-DD')는 UTC 자정이라 날짜가 어긋남)
export const fromDateString = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

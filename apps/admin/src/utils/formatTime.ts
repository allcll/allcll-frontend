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

const pad = (value: number) => String(value).padStart(2, '0');

// 로컬 기준 YYYY-MM-DD로 변환 (toISOString은 UTC라 이른 시간대에 날짜가 하루 어긋남)
export const toDateString = (date: Date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

// YYYY-MM-DD를 로컬 자정으로 파싱 (new Date('YYYY-MM-DD')는 UTC 자정이라 날짜가 어긋남)
export const fromDateString = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// UTC(Z)로 내려오는 값을 로컬(KST) 24시간제로 표시 (Date getter가 로컬 타임존 변환).
export const formatDateTime = (dateString: string) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';

  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

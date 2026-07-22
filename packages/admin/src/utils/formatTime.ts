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

// UTC(Z)로 내려오는 값을 로컬(KST) 24시간제로 표시 (Date getter가 로컬 타임존 변환).
export const formatDateTime = (dateString: string) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';

  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

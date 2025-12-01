export const formatKoreanDate = (dateString: string) => {
  if (!dateString) return '';

  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let hour = date.getHours();
  const minute = String(date.getMinutes()).padStart(2, '0');

  const isAM = hour < 12;
  const ampm = isAM ? '오전' : '오후';

  hour = hour % 12;
  hour = hour === 0 ? 12 : hour;

  return `${year}년 ${month}월 ${day}일 ${ampm} ${String(hour).padStart(2, '0')}시 ${minute}분`;
};

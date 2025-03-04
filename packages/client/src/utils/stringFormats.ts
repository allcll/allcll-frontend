// Todo: 초당 갱신되는 컴포넌트 만들기
export function getTimeDiffString(time?: string) {
  if (!time)
    return "검색 중";

  const now = new Date();
  const date = new Date(time);
  const diff = now.getTime() - date.getTime();

  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);
  const month = Math.floor(day / 30);
  const year = Math.floor(month / 12);

  if (year > 0)
    return `${year}년 전`;
  if (month > 0)
    return `${month}개월 전`;
  if (day > 0)
    return `${day}일 전`;
  if (hour > 0)
    return `${hour}시간 전`;
  if (min > 0)
    return `${min}분 전`;
  if (sec > 0)
    return `${sec}초 전`;

  return "방금 전";
}

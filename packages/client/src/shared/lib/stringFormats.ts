// Todo: 초당 갱신되는 컴포넌트 만들기
export function getTimeDiffString(time?: string) {
  if (!time) return '여석 확인 중';

  const now = new Date();
  const date = new Date(time);
  const diff = now.getTime() - date.getTime();

  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);
  const month = Math.floor(day / 30);
  const year = Math.floor(month / 12);

  if (year > 0) return `${year}년 전`;
  if (month > 0) return `${month}개월 전`;
  if (day > 0) return `${day}일 전`;
  if (hour > 0) return `${hour}시간 전`;
  if (min > 0) return `${min}분 전`;
  if (sec > 0) return `${sec}초 전`;

  return '방금 전';
}

export function levenshtein(str1: string, str2: string) {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(null));

  for (let i = 0; i <= len1; i++) {
    matrix[i][0] = i;
  }

  for (let i = 0; i <= len2; i++) {
    matrix[0][i] = i;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }

  return matrix[len1][len2];
}

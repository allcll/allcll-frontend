/**
 * JSON 문자열을 안전하게 파싱하여 지정한 타입으로 반환합니다.
 * 파싱 중 에러가 발생하면 콘솔에 에러를 기록하고 null 을 반환합니다.
 *
 * @template T - 파싱 결과물에 기대하는 데이터 타입
 * @param data - 파싱할 JSON 형식의 문자열
 * @returns 파싱에 성공하면 `T` 타입의 객체를, 실패하면 null 을 반환합니다. */
export const jsonParse = <T>(data: string): T | null => {
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
};

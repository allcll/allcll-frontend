/** API가 요청하는 값에 오류가 있는 경우 */
export class BadRequestError extends RangeError {
  constructor(message: string) {
    super(message);
    this.name = 'ParamsInvalidError';
  }
}

/************** Client **************/

/** 페이지가 존재하지 않는 경우 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

/************** API **************/

/**
 * 백엔드 에러 응답 스펙: { code: string, message: string }
 * status: HTTP 상태 코드
 * code: 백엔드 에러 코드 (예: "DUPLICATE_SCHEDULE")
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly method: string = 'GET',
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** fetch 자체가 실패한 경우 (네트워크 단절, 타임아웃) */
export class NetworkError extends Error {
  constructor(message = '네트워크 연결을 확인해주세요') {
    super(message);
    this.name = 'NetworkError';
  }
}

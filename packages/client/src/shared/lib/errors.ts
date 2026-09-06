/************** API **************/

/** 서버가 code/message 를 담아 응답한 경우 */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

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

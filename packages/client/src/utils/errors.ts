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

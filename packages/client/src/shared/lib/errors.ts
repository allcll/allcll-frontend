/************** API **************/

/**
 * 서버가 code/message 를 담아 응답한 경우
 *
 * message 는 로그에 남길 용도라 화면에 그대로 쓰면 안 됩니다.
 * 화면 문구는 code 로 정하고, 서버가 준 문구가 필요하면 serverMessage 를 쓰세요.
 */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  /** 서버가 내려준 안내 문구. 없으면 null 이라 화면이 자기 문구를 쓸 수 있습니다. */
  readonly serverMessage: string | null;

  constructor(status: number, code: string, serverMessage: string | null) {
    // Sentry 는 name/message/stack 만 전송해서, 상태와 코드를 message 에 담아야 로그에 남습니다.
    super([String(status), code, serverMessage].filter(Boolean).join(' '));
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.serverMessage = serverMessage;
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

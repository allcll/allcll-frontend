export const TokenNotFoundError = {
  code: 'TOKEN_NOT_FOUND',
  message: '토큰이 존재하지 않습니다.',
};

export const TokenExpiredError = {
  code: 'TOKEN_EXPIRED',
  message: '만료된 토큰입니다.',
};

export const TokenInvalidError = {
  code: 'TOKEN_INVALID',
  message: '유효하지 않은 토큰입니다.',
};

// Pin 관련 에러
export const MaxPinedSubjectsError = {
  code: 'MAX_PINED_SUBJECTS',
  message: '최대 과목 갯수를 초과했습니다.',
};

export const NotPinedSubjectError = {
  code: 'NOT_PINED_SUBJECT',
  message: '핀이 되어있는 과목이 아닙니다.',
};

export const SubjectNotFoundError = {
  code: 'SUBJECT_NOT_FOUND',
  message: '과목을 찾을 수 없습니다.',
};

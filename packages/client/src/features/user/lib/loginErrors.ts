import { ApiError } from '@/shared/lib/errors.ts';

export type LoginErrorTone = 'error' | 'neutral';

/** 포털에 나가야만 풀리는 경우에만 붙입니다. */
export interface LoginErrorAction {
  label: string;
  href: string;
}

export interface LoginErrorView {
  tone: LoginErrorTone;
  title: string;
  description: string;
  action?: LoginErrorAction;
}

/**
 * 미동의나 비밀번호 변경 대상이면 포털이 로그인 직후 해당 화면을 띄워줍니다.
 * 직링크는 포털 세션이 필요한데 우리 로그인 시도가 그 세션을 끊어서, 로그인 화면으로만 보냅니다.
 */
const SEJONG_PORTAL_LOGIN =
  'https://portal.sejong.ac.kr/jsp/login/loginSSL.jsp?rtUrl=portal.sejong.ac.kr/comm/member/user/ssoLoginProc.do';

const PORTAL_ACTION: LoginErrorAction = { label: '세종대 포털로 이동', href: SEJONG_PORTAL_LOGIN };
const INQUIRY_ACTION: LoginErrorAction = { label: '문의하기', href: 'https://forms.gle/bCDTVujEHunnvHe88' };

/**
 * 포털에서 정보를 받아오지 못한 경우입니다.
 * 로그인 요청과 정보 조회 중 어디서 끊겼든 기다렸다 다시 하는 것 말고는 할 수 있는 게 없어,
 * 세 코드가 같은 화면을 씁니다.
 */
const PORTAL_UNAVAILABLE_VIEW: LoginErrorView = {
  tone: 'neutral',
  title: '세종대 포털 응답 없음',
  description: '현재 세종대 포털에서 응답을 받아올 수 없습니다. 잠시 후 다시 시도해주세요.',
};

/** 백엔드 에러 코드별로 로그인 화면에 보여줄 내용입니다. */
const LOGIN_ERROR_VIEWS: Record<string, LoginErrorView> = {
  SEJONG_LOGIN_FAIL: {
    tone: 'error',
    title: '학번 또는 비밀번호 오류',
    description: '세종대 포털에서 로그인이 되는지 먼저 확인해보세요.',
  },
  SEJONG_PRIVACY_CONSENT_REQUIRED: {
    tone: 'error',
    title: '개인정보 수집 동의 필요',
    description: '세종대 포털에서 개인정보 수집 동의 후 다시 시도해주세요.',
    action: PORTAL_ACTION,
  },
  SEJONG_PASSWORD_CHANGE_REQUIRED: {
    tone: 'error',
    title: '비밀번호 변경 필요',
    description: '세종대 포털에서 비밀번호 변경 후 다시 시도해주세요.',
    action: PORTAL_ACTION,
  },
  SEJONG_ACCOUNT_LOCKED: {
    tone: 'error',
    title: '계정 상태 확인 필요',
    description: '계정 상태가 올바른지 포털에서 확인 후 다시 시도해주세요.',
    action: PORTAL_ACTION,
  },
  SEJONG_LOGIN_IO_ERROR: PORTAL_UNAVAILABLE_VIEW,
  USER_INFO_FETCH_IO_ERROR: PORTAL_UNAVAILABLE_VIEW,
  USER_INFO_FETCH_FAIL: PORTAL_UNAVAILABLE_VIEW,
  DEPARTMENT_NOT_FOUND: {
    tone: 'error',
    title: '학과 정보 미등록',
    description: '학과 정보가 등록되어 있지 않습니다. 문의를 남겨주시면 확인 후 등록해드리겠습니다.',
    action: INQUIRY_ACTION,
  },
};

const FALLBACK_VIEW: LoginErrorView = {
  tone: 'error',
  title: '로그인 실패',
  description: '잠시 후 다시 시도해주세요.',
};

const NETWORK_VIEW: LoginErrorView = {
  tone: 'neutral',
  title: '네트워크 연결 없음',
  description: '연결 상태를 확인한 뒤 다시 시도해주세요.',
};

/** 로그인 실패 에러를 화면에 보여줄 형태로 바꿉니다. */
export function toLoginErrorView(error: Error): LoginErrorView {
  // fetch 자체가 실패하면 응답이 없어서 ApiError 로 오지 않습니다.
  if (error instanceof TypeError) {
    return NETWORK_VIEW;
  }

  if (!(error instanceof ApiError)) {
    return FALLBACK_VIEW;
  }

  return LOGIN_ERROR_VIEWS[error.code] ?? FALLBACK_VIEW;
}

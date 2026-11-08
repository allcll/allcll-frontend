interface LabelItem {
  title: string;
  desc: string;
}

export const LABELS: LabelItem[] = [
  {
    title: '개인정보 수집',
    desc: '세종대학교 학번, 성명, 학부정보 등',
  },
  {
    title: '개인정보 처리 목적',
    desc: '세종대 시스템 연동, 사용자 인증 및 학사 정보 조회',
  },
  {
    title: '개인정보 보유 기간',
    desc: '회원 탈퇴 시까지, 로그아웃 시까지',
  },
  {
    title: '개인정보 제3자 제공',
    desc: '세종대학교 시스템 연동',
  },
  {
    title: '개인정보 파기',
    desc: '회원 탈퇴 시 즉시 삭제',
  },
  {
    title: '고충처리 부서',
    desc: '올클(ALLCLL) 개발자 (allclllclla@gmail.com)',
  },
] as const;

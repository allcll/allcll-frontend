/** og:url과 og:image에 붙이는 주소. 상대 경로를 읽지 못하는 미리보기 봇이 있어 절대 주소로 씁니다 */
export const SITE_ORIGIN = 'https://allcll.kr';

export interface IOgPage {
  /** 앞뒤 슬래시 없는 경로. 빌드 결과에 `${path}/index.html`로 생깁니다 */
  path: string;
  title: string;
  description: string;
  /** public/og/ 안의 파일 이름 */
  image: string;
}

/** 메인(/)과 여기에 없는 경로는 index.html의 값을 그대로 씁니다 */
export const OG_PAGES: IOgPage[] = [
  {
    path: 'timetable',
    title: 'ALLCLL | 시간표',
    description: '듣고 싶은 과목을 넣으며 시간표를 짜 보세요. 과목별 관심 인원도 볼 수 있어요.',
    image: 'timetable.png',
  },
  {
    path: 'wishes',
    title: 'ALLCLL | 관심과목',
    description: '듣고 싶은 과목을 몇 명이 담았는지 보고 신청 순서를 정해 보세요.',
    image: 'wishes.png',
  },
  {
    path: 'simulation',
    title: 'ALLCLL | 올클연습',
    description: '실제와 비슷한 화면에서 신청해 보고 어느 단계에서 느렸는지 확인해 보세요.',
    image: 'simulation.png',
  },
  {
    path: 'live',
    title: 'ALLCLL | 실시간여석',
    description: '올클 탭을 열어 두면 등록한 과목에 여석이 생길 때 알려 드려요.',
    image: 'live.png',
  },
  {
    path: 'graduation',
    title: 'ALLCLL | 졸업요건검사',
    description: '세종대 포털 로그인 후 성적 파일을 올리면 남은 학점과 졸업인증을 볼 수 있어요.',
    image: 'graduation.png',
  },
  {
    path: 'survey',
    title: 'ALLCLL | 오류 및 제안',
    description: '쓰다가 막힌 부분이나 있으면 좋겠다 싶은 기능을 알려 주세요.',
    image: 'survey.png',
  },
  {
    path: 'faq',
    title: 'ALLCLL | 자주 묻는 질문',
    description: '알림이 안 울리거나 여석이 언제 갱신되는지 궁금할 때 먼저 찾아보세요.',
    image: 'faq.png',
  },
  {
    path: 'privacy-policy',
    title: 'ALLCLL | 개인정보 처리방침',
    description: '학번과 학점 같은 정보를 왜 받고 언제 지우는지 확인할 수 있어요.',
    image: 'privacy-policy.png',
  },
];

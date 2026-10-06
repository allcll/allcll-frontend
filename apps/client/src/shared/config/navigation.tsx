import { ChatHelpIcon, HeadsetIcon } from '@allcll/allcll-ui';

/** 헤더, 모바일 메뉴, 푸터가 함께 쓰는 메뉴 목록 */
export const HeaderContents = [
  // { title: '과목검색', path: '/wishes', end: false },
  { title: '시간표', path: '/timetable', end: false },
  { title: '관심과목', path: '/wishes', end: true },
  { title: '올클연습', path: '/simulation', end: false },
  { title: '실시간여석', path: '/live', end: false },
  { title: '졸업요건검사', path: '/graduation', end: false, beta: true },
];

export const ButtonContents = [
  {
    icon: <HeadsetIcon className="w-4 h-4 text-gray-500" />,
    title: '오류 및 제안',
    path: 'https://forms.gle/bCDTVujEHunnvHe88',
  },
  {
    icon: <ChatHelpIcon className="w-4 h-4 text-gray-500" />,
    title: '공지 채팅방',
    path: 'https://open.kakao.com/o/g3MztXfh',
  },
];

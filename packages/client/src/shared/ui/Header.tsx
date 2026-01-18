import { Link, NavLink } from 'react-router-dom';
import LogoSvg from '@public/ci.svg?react';
import LogoName from '@public/logo-name.svg?react';
import HelpDeskSvg from '@/assets/help-desk.svg?react';
import HelpChatSvg from '@/assets/chat-help.svg?react';

export const HeaderContents = [
  // { title: '과목검색', path: '/wishes', end: false },
  { title: '시간표', path: '/timetable', end: false },
  { title: '관심과목', path: '/wishes', end: true },
  { title: '올클연습', path: '/simulation', end: false },
  { title: '실시간', path: '/live', end: false },
];

const ButtonContents = [
  { icon: <HelpDeskSvg className="w-4 h-4" />, title: '오류 및 제안', path: 'https://forms.gle/bCDTVujEHunnvHe88' },
  {
    icon: <HelpChatSvg className="w-4 h-4" />,
    title: '공지 채팅방',
    path: 'https://open.kakao.com/o/g3MztXfh',
  },
];

function Header() {
  return (
    <header className="bg-white shadow-sm z-50 sticky top-0">
      <div className="container flex items-center justify-between mx-auto max-w-7xl px-4 md:px-16">
        <div className="flex items-center space-x-4 py-4">
          <Link to="/" className="flex items-center gap-1 space-x-2" aria-label="메인 페이지">
            <h1 className="hidden">ALLCLL</h1>
            <LogoSvg className="w-6 h-6 m-0" />
            <LogoName className="h-5 hidden sm:inline-block" />
          </Link>

          <ul className="flex space-x-4 text-sm sm:text-base">
            {HeaderContents.map(({ title, path, end }) => (
              <li key={path} className="font-bold">
                <NavLink
                  to={path}
                  end={end}
                  className={({ isActive }) => (isActive ? 'text-blue-500 font-semibold' : 'text-gray-500')}
                >
                  {title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="items-center space-x-2 hidden sm:flex">
          {ButtonContents.map(({ icon, title, path }) => (
            <a
              className="p-2 rounded-md hover:bg-gray-100"
              target="_blank"
              key={path}
              href={path}
              aria-label={title}
              title={title}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Header;

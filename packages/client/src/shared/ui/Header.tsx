import { useCallback, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logoCiUrl from '@/assets/logo/ci-summer.svg';
import logoNameUrl from '@/assets/logo/logo-name-summer.svg';
import { ChatHelpIcon, HeadsetIcon, MenuIcon } from '@allcll/allcll-ui';
import { IconButton, Badge } from '@allcll/allcll-ui';
import NoticeBell from '@/features/notices/ui/NoticeBell';
import MobileMenu from './MobileMenu';

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

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = () => setIsOpen(true);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <header className="bg-white shadow-sm z-header sticky top-0">
      <div className="container flex items-center justify-between mx-auto max-w-7xl px-4 md:px-16">
        <div className="flex items-center space-x-4 py-4">
          <Link to="/" className="flex items-center gap-1 space-x-2" aria-label="메인 페이지">
            <h2 className="hidden">ALLCLL</h2>
            <img src={logoCiUrl} alt="" className="w-6 h-6 m-0" />
            <img src={logoNameUrl} alt="" className="h-5" />
          </Link>

          <ul className="hidden md:flex space-x-4 text-sm sm:text-base">
            {HeaderContents.map(({ title, path, end, beta }) => (
              <li key={path} className="font-bold">
                <NavLink
                  to={path}
                  end={end}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1 ${isActive ? 'text-blue-500 font-semibold' : 'text-gray-500'}`
                  }
                >
                  {title}
                  {beta && (
                    <Badge variant="beta" appearance="outline" size="small">
                      Beta
                    </Badge>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="items-center space-x-2 hidden md:flex">
          {ButtonContents.map(({ icon, title, path }) => (
            <a
              key={path}
              href={path}
              target="_blank"
              aria-label={title}
              title={title}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {icon}
            </a>
          ))}
          <NoticeBell />
        </div>
        <div className="md:hidden flex items-center gap-1">
          <NoticeBell />
          <IconButton
            className="p-2 hover:bg-gray-100 active:bg-gray-100"
            variant="plain"
            icon={<MenuIcon className="w-6 h-6" />}
            label="메뉴 열기"
            onClick={openMenu}
            aria-expanded={isOpen}
          />
        </div>
      </div>

      <MobileMenu isOpen={isOpen} onClose={closeMenu} />
    </header>
  );
}

export default Header;

import Logo from '@public/ci.svg?react';
import BookSvg from '@/assets/book.svg?react';
import PinSvg from '@/assets/pin.svg?react';
import DebugSvg from '@/assets/debug.svg?react';
import { NavLink } from 'react-router-dom';

const Menus = [
  {
    title: '과목 관리',
    icon: <BookSvg />,
    link: '/',
  },
  {
    title: '핀 현황',
    icon: <PinSvg fill="#777777" />,
    link: '/pins',
  },
  {
    title: '버그 및 제보',
    icon: <DebugSvg />,
    link: '/bugs',
  },
];

function SideNavBar() {
  return (
    <>
      <div className="p-6 mb-6">
        <Logo className="h-8 w-auto" />
      </div>
      <nav>
        <ul>
          {Menus.map(menu => (
            <li key={menu.link}>
              <NavLink
                to={menu.link}
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center gap-4 block px-4 py-3 text-blue-600 font-semibold bg-blue-50'
                    : 'flex items-center gap-4 block px-4 py-3 text-gray-500'
                }
              >
                <span className="w-6">{menu.icon}</span>
                {menu.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export default SideNavBar;

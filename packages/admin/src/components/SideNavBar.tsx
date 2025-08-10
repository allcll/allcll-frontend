import Logo from '@public/ci.svg?react';
import BookSvg from '@/assets/book.svg?react';

import { NavLink } from 'react-router-dom';

const Menus = [
  {
    title: '대시보드',
    icon: <BookSvg />,
    link: '/',
  },
  {
    title: '크롤러 설정',
    link: '/clawlers',
  },
  {
    title: '서비스 설정',
    link: '/service',
  },
  {
    title: '로그 설정',
    link: '/logs',
  },
];

function SideNavBar() {
  return (
    <aside className="w-64 bg-white shadow-md hidden md:block">
      <div className="p-6 mb-6">
        <Logo className="h-8 w-8" />
      </div>
      <nav>
        <ul>
          {Menus.map(menu => (
            <li key={menu.link}>
              <NavLink
                to={menu.link}
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center gap-4 block px-4 py-3 text-blue-500 font-semibold bg-blue-50'
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
    </aside>
  );
}

export default SideNavBar;

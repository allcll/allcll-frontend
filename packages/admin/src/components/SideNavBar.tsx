import { BookIcon } from '@allcll/allcll-ui';

import { NavLink } from 'react-router-dom';

const Menus = [
  {
    title: '대시보드',
    icon: <BookIcon className="w-5 h-5" />,
    link: '/',
  },
  {
    title: '크롤러 설정',
    link: '/crawlers',
  },
  {
    title: '졸업요건 설정',
    link: '/graduation',
  },
  {
    title: '서비스 설정',
    link: '/service',
  },
  {
    title: '로그 설정',
    link: '/logs',
  },
  {
    title: '사용자 후기',
    link: '/reviews',
  },
  {
    title: '공지사항',
    link: '/notices',
  },
];

function SideNavBar() {
  return (
    <aside className="w-64 bg-white shadow-md hidden md:block sticky top-0 h-screen">
      <div className="p-6 mb-6">
        <img src={`${import.meta.env.BASE_URL}ci.svg`} alt="" className="h-8 w-8" />
      </div>
      <nav>
        <ul>
          {Menus.map(menu => (
            <li key={menu.link}>
              <NavLink
                to={menu.link}
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center gap-4 px-4 py-3 text-blue-500 font-semibold bg-blue-50'
                    : 'flex items-center gap-4 px-4 py-3 text-gray-500'
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

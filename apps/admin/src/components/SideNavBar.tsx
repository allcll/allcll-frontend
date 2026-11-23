import {
  BotIcon,
  DashboardIcon,
  GraduationCapIcon,
  MegaphoneIcon,
  MessageIcon,
  ScrollTextIcon,
  SettingsIcon,
} from '@allcll/allcll-ui';

import { NavLink } from 'react-router-dom';

const Menus = [
  {
    title: '대시보드',
    icon: <DashboardIcon className="w-5 h-5" />,
    link: '/',
  },
  {
    title: '크롤러 설정',
    icon: <BotIcon className="w-5 h-5" />,
    link: '/crawlers',
  },
  {
    title: '서비스 설정',
    icon: <SettingsIcon className="w-5 h-5" />,
    link: '/service',
  },
  {
    title: '공지사항 관리',
    icon: <MegaphoneIcon className="w-5 h-5" />,
    link: '/notices',
  },
  {
    title: '사용자 후기',
    icon: <MessageIcon className="w-5 h-5" />,
    link: '/reviews',
  },
  {
    title: '졸업요건 설정',
    icon: <GraduationCapIcon className="w-5 h-5" />,
    link: '/graduation',
  },
  {
    title: 'API 요청 로그',
    icon: <ScrollTextIcon className="w-5 h-5" />,
    link: '/logs',
  },
];

function SideNavBar() {
  return (
    <aside className="w-64 bg-surface shadow-md hidden md:block sticky top-0 h-screen">
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
                    ? 'flex items-center gap-4 px-4 py-3 text-primary-500 font-semibold bg-primary-subtle'
                    : 'flex items-center gap-4 px-4 py-3 text-fg-muted hover:text-fg-secondary hover:bg-surface-subtle'
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

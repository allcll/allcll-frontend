import { NavLink } from 'react-router-dom';
import { useState } from 'react';

interface IMenu {
  name: string;
  path?: string;
  children?: IMenu[];
}

const ASIDE_MENU: IMenu[] = [
  {
    name: '수강 및 변동신청',
    children: [
      {
        name: '수강신청 및 기타',
        children: [
          { name: '수강신청', path: '/simulation' },
          { name: '수강신청 결과', path: '/simulation/logs' },
          { name: '수강신청 관리', path: '/simulation/admin' },
          { name: '관심과목 담기', path: '#' },
          { name: '강의시간표/수업계획서 조회', path: '#' },
          { name: '등록이력조회/고지서출력', path: '#' },
          { name: '학적변동신청(휴학,복학등)', path: '#' },
        ],
      },
    ],
  },
];

function AsideMenu() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile] = useState(/Android|iPhone/i.test(navigator.userAgent));

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <aside
      className={
        (isOpen ? 'relative z-10' : 'relative bg-blue-50 z-10') +
        (!isOpen || isMobile ? ' w-[20px] min-w-[20px] h-[calc(100vh-60px)]' : ' w-[230px] min-w-[230px]')
      }
    >
      {isOpen ? (
        <div
          className={
            isMobile ? 'absolute w-[300px] min-w-[300px] h-full bg-white shadow-gray-800 shadow-md' : 'bg-white'
          }
        >
          <div className="h-12 bg-blue-500 text-white text-lg font-semibold flex items-center justify-between px-4">
            <span>학부생학사정보</span>
            <button className="text-white hover:text-gray-200 cursor-pointer" onClick={toggleMenu}>
              {'<'}
            </button>
          </div>

          <ul className="flex flex-col text-sm">
            {ASIDE_MENU.map((item, index) => (
              <BigMenu menu={item} key={index} />
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <button
            className="w-full h-12 bg-blue-500 text-white text-lg font-semibold text-center cursor-pointer hover:text-gray-200"
            onClick={toggleMenu}
          >
            {'>'}
          </button>
        </div>
      )}
    </aside>
  );
}

interface IMenuComponent {
  menu: IMenu;
}

const MENU_OPEN = true;

function BigMenu({ menu }: IMenuComponent) {
  const [isOpen, setIsOpen] = useState(MENU_OPEN);

  return (
    <li>
      <button
        className={
          'px-4 py-2 h-12 flex items-center justify-between w-full border-b border-neutral-300 cursor-pointer hover:bg-gray-100 ' +
          (isOpen ? 'font-semibold' : 'font-normal')
        }
        onClick={() => setIsOpen(prev => !prev)}
      >
        {menu.name}
        {menu.children && <span className="ml-auto text-gray-500">{isOpen ? '▲' : '▼'}</span>}
      </button>

      {isOpen && menu.children && (
        <ul className="">
          {menu.children.map((item, index) => (
            <MediumMenu key={index} menu={item} />
          ))}
        </ul>
      )}
    </li>
  );
}

function MediumMenu({ menu }: IMenuComponent) {
  const [isOpen, setIsOpen] = useState(MENU_OPEN);

  return (
    <li className="">
      <button
        className={
          'px-4 py-2 h-10 flex items-center gap-4 w-full border-b border-neutral-300 cursor-pointer hover:bg-gray-100 ' +
          (isOpen ? 'font-semibold' : 'font-normal')
        }
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span>{isOpen ? '-' : '+'}</span>
        <span>{menu.name}</span>
      </button>

      {isOpen && menu.children && (
        <ul className="ml-1 pl-4 bg-neutral-100 font-semibold">
          {menu.children.map((item, index) => (
            <SmallMenu key={index} menu={item} />
          ))}
        </ul>
      )}
    </li>
  );
}

function SmallMenu({ menu }: IMenuComponent) {
  return (
    <li>
      <NavLink
        to={menu.path ?? '#'}
        className={({ isActive }) =>
          `block px-2 py-2 text-xs cursor-pointer hover:bg-blue-500 hover:text-white ${isActive && menu.path != '#' ? 'bg-blue-500 text-white' : ''}`
        }
        end
      >
        {menu.name}
      </NavLink>
    </li>
  );
}

export default AsideMenu;

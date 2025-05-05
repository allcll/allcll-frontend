import { NavLink } from 'react-router-dom';

const ASIDE_MENU = [
  {
    name: '수강 및 변동신청', children: [
      {
        name: '수강신청 및 기타', children: [
          {name: '수강신청', path: '/simulation'},
          {name: '수강신청 로그', path: '/simulation/logs'},
          {name: '관심과목 담기', path: '#'},
          {name: '강의시간표/수업계획서 조회', path: '#'},
          {name: '등록이력조회/고지서출력', path: '#'},
          {name: '학적변동신청(휴학,복학등)', path: '#'},
        ]
      },
    ]
  },
];

function AsideMenu() {
  return (
    <aside className="w-[230px] min-w-[230px]">
      <div className="h-12 bg-blue-500 text-white text-lg font-semibold px-4 flex items-center">
        학부생학사정보
      </div>

      <ul className="flex flex-col text-sm font-semibold">
        {ASIDE_MENU.map((item, index) => (
          <li key={index}>
            <button className="px-4 py-2 h-12 flex items-center justify-between w-full border-b border-neutral-300 cursor-pointer hover:bg-gray-100">
              {item.name}
              {item.children && <span className="ml-auto">▼</span>}
            </button>

            {item.children && (
              <ul className="">
                {item.children.map((subItem, subIndex) => (
                  <li key={subIndex} className="">
                    <button className="px-4 py-2 h-10 flex items-center gap-4 w-full border-b border-neutral-300 cursor-pointer hover:bg-gray-100">
                      <span>+</span>
                      <span>{subItem.name}</span>
                    </button>

                    {subItem.children && (
                      <ul className="ml-1 pl-4 bg-neutral-100">
                        {subItem.children.map((subSubItem, subSubIndex) => (
                          <li key={subSubIndex} className="">
                            <NavLink to={subSubItem.path}
                                     className={({ isActive }) => `block px-2 py-2 text-xs cursor-pointer hover:bg-blue-500 hover:text-white ${isActive && subSubItem.path != '#' ? 'bg-blue-500 text-white' : ''}`}
                                     end>
                              {subSubItem.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default AsideMenu;
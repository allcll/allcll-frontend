import { useState } from 'react';
import type { IMenu } from './types';
import BigMenu from './BigMenu';

interface AsideMenuProps {
  menus: IMenu[];
}

function AsideMenu({ menus }: AsideMenuProps) {
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
            {menus.map(item => (
              <BigMenu menu={item} key={item.name} />
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

export default AsideMenu;

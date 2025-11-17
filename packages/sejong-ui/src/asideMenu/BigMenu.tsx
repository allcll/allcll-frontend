import { useState } from 'react';
import type { IMenu } from './types';
import MediumMenu from './MediumMenu';

interface BigMenuProps {
  menu: IMenu;
}

const MENU_OPEN = true;

function BigMenu({ menu }: BigMenuProps) {
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

export default BigMenu;

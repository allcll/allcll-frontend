import { useState } from 'react';
import type { IMenu } from './types';
import SmallMenu from './SmallMenu';

interface MediumMenuProps {
  menu: IMenu;
}

const MENU_OPEN = true;

function MediumMenu({ menu }: MediumMenuProps) {
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

export default MediumMenu;

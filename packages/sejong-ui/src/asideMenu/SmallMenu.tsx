import { NavLink } from 'react-router-dom';
import type { IMenu } from './types';

interface SmallMenuProps {
  menu: IMenu;
}

function SmallMenu({ menu }: SmallMenuProps) {
  return (
    <li>
      {menu.path === '#' ? (
        <div className="block px-2 py-2 text-xs text-gray-400 cursor-not-allowed">{menu.name}</div>
      ) : (
        <NavLink
          to={menu.path ?? '#'}
          className={({ isActive }) =>
            `block px-2 py-2 text-xs cursor-pointer hover:bg-blue-500 hover:text-white ${isActive ? 'bg-blue-500 text-white' : ''}`
          }
          end
        >
          {menu.name}
        </NavLink>
      )}
    </li>
  );
}

export default SmallMenu;

import { NavLink } from 'react-router-dom';
import type { ITab } from './TabContext';
import XIcon from '../assets/x.svg?react';

interface SimulationTabItemProps {
  tab: ITab;
  onDelete: (urlPath: string) => void;
}

function TabItem({ tab, onDelete }: SimulationTabItemProps) {
  return (
    <NavLink
      to={tab.realUrl}
      className={({ isActive }) =>
        'group px-2.5 flex items-center gap-2.5 w-1/4 sm:w-1/8 border-r-1 border-r-neutral-300 cursor-pointer focus:outline-none' +
        (isActive
          ? ' mb-[-1px] bg-white border-b-2 border-b-white border-t-4 border-t-blue-500 font-semibold text-blue-500'
          : ' text-gray-500 hover:bg-white')
      }
      end
    >
      <span className="flex-1 text-center overflow-hidden text-ellipsis text-nowrap rounded-xs group-focus:outline-black group-focus:outline-2">
        {tab.title}
      </span>
      <button
        tabIndex={-1}
        aria-label="탭 닫기"
        className="w-4 text-gray-700 hover:text-blue-500 cursor-pointer"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(tab.urlPath);
        }}
      >
        <XIcon className="w-3 h-3" />
      </button>
    </NavLink>
  );
}

export default TabItem;

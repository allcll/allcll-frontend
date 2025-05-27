import useTabStore, { useSimulationTab } from '@/store/simulation/useTabStore.ts';
import { NavLink, useNavigate } from 'react-router-dom';

function SimulationTabs() {
  const tabs = useTabStore(state => state.tabs);
  const deleteTab = useTabStore(state => state.deleteTab);
  const navigate = useNavigate();

  useSimulationTab();

  return (
    <div className="flex border-b border-neutral-300 bg-gray-100 text-sm h-12">
      {tabs.map(item => (
        <NavLink
          key={item.urlPath}
          to={item.realUrl}
          className={({ isActive }) =>
            'px-2.5 flex items-center gap-2.5 w-1/8 border-r-1 border-r-neutral-300 cursor-pointer' +
            (isActive
              ? ' mb-[-1px] bg-white border-b-2 border-b-white border-t-4 border-t-blue-500 font-semibold text-blue-500'
              : ' text-gray-500 hover:bg-white')
          }
          end
        >
          <span className="flex-1 text-center overflow-hidden text-ellipsis text-nowrap">{item.title}</span>
          <button
            className="w-4 text-gray-700 cursor-pointer"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              deleteTab(item.urlPath, navigate);
            }}
          >
            x
          </button>
        </NavLink>
      ))}
    </div>
  );
}

export default SimulationTabs;

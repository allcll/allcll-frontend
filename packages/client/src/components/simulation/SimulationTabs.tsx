import useTabStore, { useSimulationTab } from '@/store/simulation/useTabStore.ts';
import { NavLink, useNavigate } from 'react-router-dom';

// const TabMenu = [
//   { name: '관심과목 담기', path: '#' },
//   { name: '수강신청', path: '#', active: true },
// ];

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
            'px-8 flex items-center gap-2 cursor-pointer border-r-1 border-r-neutral-300' +
            (isActive
              ? '  mb-[-1px] bg-white border-b-2 border-b-white border-t-4 border-t-blue-500 font-semibold text-blue-500'
              : '  text-gray-500')
          }
          end
        >
          <span>{item.title}</span>
          <button className="text-gray-700" onClick={() => deleteTab(item.urlPath, navigate)}>
            x
          </button>
        </NavLink>
      ))}
    </div>
  );
}

export default SimulationTabs;

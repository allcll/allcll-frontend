import { NavLink } from 'react-router-dom';

const TabMenu = [
  { name: '관심과목 담기', path: '/simulation/wishlist', end: true },
  { name: '수강신청', path: '/simulation/simulation', end: true },
];

function SimulationTabs() {
  return (
    <div className="flex border-b border-neutral-300 bg-gray-100 text-sm h-12">
      {TabMenu.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) =>
            'px-8 flex items-center gap-2 cursor-pointer border-r border-r-neutral-300 ' +
            (isActive
              ? 'mb-[-1px] bg-white border-b-2 border-b-white border-t-4 border-t-blue-500 font-semibold text-blue-500'
              : 'text-gray-500')
          }
        >
          <span>{item.name}</span>
          <button className="text-gray-700">x</button>
        </NavLink>
      ))}
    </div>
  );
}

export default SimulationTabs;

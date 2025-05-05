const TabMenu = [
  { name: '관심과목 담기', path: '#' },
  { name: '수강신청', path: '#', active: true },
];

function SimulationTabs() {
  return (
    <div className="flex border-b border-neutral-300 bg-gray-100 text-sm h-12">
      {TabMenu.map((item, index) => (
        <div
          key={index}
          className={
            'px-8 flex items-center gap-2 cursor-pointer border-r-1 border-r-neutral-300' +
            (item.active
              ? '  mb-[-1px] bg-white border-b-2 border-b-white border-t-4 border-t-blue-500 font-semibold text-blue-500'
              : '  text-gray-500')
          }
        >
          <span>{item.name}</span>
          <button className="text-gray-700">x</button>
        </div>
      ))}
    </div>
  );
}

export default SimulationTabs;

function Line({ active }: { active: boolean }) {
  return <div className={`flex-1 h-[2px] mt-[15px] md:mt-0 ${active ? 'bg-blue-500' : 'bg-gray-300'}`}></div>;
}

export default Line;

function Line({ active }: { active: boolean }) {
  return <div className={`flex-1 h-[2px] ${active ? 'bg-blue-500' : 'bg-gray-300'}`}></div>;
}

export default Line;

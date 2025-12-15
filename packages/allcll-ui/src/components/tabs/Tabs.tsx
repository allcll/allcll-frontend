function Tabs({ children }: { children: React.ReactNode }) {
  return (
    <ul role="tablist" className="flex space-x-5 py-5 px-2 text-sm sm:text-base border-b border-gray-200">
      {children}
    </ul>
  );
}

export default Tabs;

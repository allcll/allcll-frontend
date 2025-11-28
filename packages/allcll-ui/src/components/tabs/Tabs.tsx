function Tabs({ children }: { children: React.ReactNode }) {
  return (
    <ul role="tablist" className="flex space-x-4 text-sm sm:text-base">
      {children}
    </ul>
  );
}

export default Tabs;

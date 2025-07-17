interface IDropdown {
  children: React.ReactNode;
}

function Dropdown({ children }: IDropdown) {
  return (
    <div className="flex flex-col gap-4 p-4 border-none rounded-lg items-center justify-center bg-white shadow-sm">
      {children}
    </div>
  );
}

export default Dropdown;

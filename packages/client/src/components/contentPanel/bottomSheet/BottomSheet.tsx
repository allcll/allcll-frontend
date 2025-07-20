interface IBottomSheet {
  children: React.ReactNode;
}

function BottomSheet({ children }: IBottomSheet) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl flex flex-col">
      {/*Handler*/}
      <div className="w-full flex justify-center py-2">
        <div className="w-15 h-1.5 cursor-pointer bg-gray-300 rounded-full" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 max-h-200 min-h-50">{children}</div>
    </div>
  );
}

export default BottomSheet;

interface IDialogContents {
  children: React.ReactNode;
  width?: string;
  height?: string;
}

function DialogContents({ children, width, height }: IDialogContents) {
  const dialogSize = getDialogSizeClass(width, height);

  return (
    <div
      className={`flex flex-col justify-center item bg-white min-w-80 max-w-[90%] rounded-lg sm:${dialogSize}`}
      onClick={e => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

export default DialogContents;

function getDialogSizeClass(width?: string, height?: string) {
  const widthClass = width ? `w-${width}` : 'max-w-[90%]';
  const heightClass = height ? `h-${height}` : 'auto';
  return `${widthClass} ${heightClass}`;
}

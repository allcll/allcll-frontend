interface IDialogContents {
  children: React.ReactNode;
  width?: string;
  height?: string;
}

function DialogContents({ children, width, height }: IDialogContents) {
  const dialogSize = getDialogSizeClass(width, height);

  return (
    <div
      className={`z-60 bg-white rounded shadow-lg min-w-100 rounded-lg ${dialogSize}`}
      onClick={e => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

export default DialogContents;

function getDialogSizeClass(width?: string, height?: string) {
  const widthClass = width ? `w-${width}` : 'w-200 sm:w-fit';
  const heightClass = height ? `h-${height}` : 'max-h-150';
  return `${widthClass} ${heightClass}`;
}

export type DialogSize = 'medium' | 'large';

interface IDialogContents {
  children: React.ReactNode;
  size?: DialogSize;
}

const SIZE_CLASS: Record<DialogSize, string> = {
  medium: 'max-w-[90%]',
  large: 'w-[90%] max-w-3xl',
};

function DialogContents({ children, size = 'medium' }: IDialogContents) {
  return (
    <div
      className={`flex flex-col justify-center bg-white min-w-80 max-h-[90vh] rounded-lg ${SIZE_CLASS[size]}`}
      onClick={e => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

export default DialogContents;

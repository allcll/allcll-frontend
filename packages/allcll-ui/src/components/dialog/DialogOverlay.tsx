import { useRef } from 'react';

interface IDialogOverlay {
  children: React.ReactNode;
  onClose: () => void;
}

function DialogOverlay({ children, onClose }: IDialogOverlay) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center bg-transparent justify-center z-50"
      role="none"
      ref={containerRef}
      onClick={handleBackdropClick}
    >
      {children}
    </div>
  );
}

export default DialogOverlay;

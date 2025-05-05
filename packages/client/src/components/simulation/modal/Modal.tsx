interface IModalProps {
  children: React.ReactNode;
}

function Modal({ children }: IModalProps) {
  return (
    <div>
      <div className="fixed top-0 left-0 w-full h-full bg-gray-300 opacity-30 flex items-center justify-center z-50"></div>

      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">{children}</div>
    </div>
  );
}

export default Modal;

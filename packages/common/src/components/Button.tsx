interface IButton {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  variants?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
}

function getButtonColor(variants: 'primary' | 'secondary' | undefined) {
  return variants === 'primary'
    ? 'bg-blue-500 text-white hover:bg-blue-600 focus:outline-blue-400'
    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-600';
}

function CustomButton({ children, onClick, className = '', disabled = false, variants, type = 'button' }: IButton) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-2 cursor-pointer rounded-lg ${getButtonColor(variants)} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default CustomButton;

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variants?: 'primary' | 'secondary';
}

function getButtonColor(variants: 'primary' | 'secondary' | undefined) {
  return variants === 'primary'
    ? 'bg-blue-500 text-white hover:bg-blue-600 focus:outline-blue-400'
    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-600';
}

function CustomButton({ children, variants, className = '', ...props }: Readonly<IButton>) {
  return (
    <button
      type={props.type}
      onClick={props.onClick}
      className={`px-4 py-2 cursor-pointer rounded-lg ${getButtonColor(variants)} ${className}`}
      disabled={props.disabled}
    >
      {children}
    </button>
  );
}

export default CustomButton;

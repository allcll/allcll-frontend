interface IToggle {
  checked: boolean;
  onChange: () => void;
}

function Toggle({ checked, onChange }: IToggle) {
  return (
    <button
      onClick={onChange}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
        checked ? 'bg-blue-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`w-4 h-4 cursor-pointer bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default Toggle;

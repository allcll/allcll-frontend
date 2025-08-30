import { InputHTMLAttributes } from 'react';

function Toggle({ children, checked, onChange, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} {...props} />

      {/* Toggle Track (visual background) */}
      <div className="w-12 h-6 rounded-full transition-colors duration-150 bg-gray-300 peer-checked:bg-blue-500 peer-disabled:bg-gray-200"></div>

      {/* Toggle Knob (white circle) */}
      <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-150 peer-checked:translate-x-6"></div>

      {/* Label content (children) */}
      {children}
    </label>
  );
}

export default Toggle;

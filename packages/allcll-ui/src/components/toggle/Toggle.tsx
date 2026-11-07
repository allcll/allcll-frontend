import type { ComponentPropsWithoutRef } from 'react';

interface ToggleProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'onChange'> {
  onCheckedChange?: (checked: boolean) => void;
}

function Toggle({ className = '', onCheckedChange, ...props }: ToggleProps) {
  return (
    <label
      className={`relative inline-flex items-center cursor-pointer has-[:disabled]:cursor-not-allowed ${className}`}
    >
      <input type="checkbox" className="sr-only peer" onChange={e => onCheckedChange?.(e.target.checked)} {...props} />

      <span className="w-12 h-6 rounded-full transition-colors duration-150 bg-gray-300 peer-checked:bg-primary-500 peer-disabled:bg-gray-200 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-300 peer-focus-visible:ring-offset-2" />
      <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-150 peer-checked:translate-x-6" />
    </label>
  );
}

export default Toggle;

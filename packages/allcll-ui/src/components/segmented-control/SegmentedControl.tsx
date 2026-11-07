interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  'aria-label': string;
  className?: string;
}

function SegmentedControl<T extends string>({
  options,
  value,
  onValueChange,
  className = '',
  ...rest
}: Readonly<SegmentedControlProps<T>>) {
  return (
    <div role="radiogroup" className={`flex p-0.5 rounded-md bg-gray-100 ${className}`} {...rest}>
      {options.map(option => {
        const checked = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            disabled={option.disabled}
            onClick={() => !checked && onValueChange(option.value)}
            className={`px-2 py-0.5 rounded text-xs transition-colors disabled:text-gray-300 disabled:cursor-not-allowed ${
              checked ? 'bg-white text-gray-900 font-medium shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;

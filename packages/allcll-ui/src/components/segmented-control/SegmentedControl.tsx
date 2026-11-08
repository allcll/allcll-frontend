import { useRef, type KeyboardEvent } from 'react';

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

const NEXT_KEYS = ['ArrowRight', 'ArrowDown'];
const PREV_KEYS = ['ArrowLeft', 'ArrowUp'];

function SegmentedControl<T extends string>({
  options,
  value,
  onValueChange,
  className = '',
  ...rest
}: Readonly<SegmentedControlProps<T>>) {
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const enabledIndexes = options.flatMap((option, index) => (option.disabled ? [] : [index]));
  const hasChecked = options.some(option => option.value === value && !option.disabled);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const position = enabledIndexes.indexOf(index);
    const count = enabledIndexes.length;
    let target: number | undefined;

    if (NEXT_KEYS.includes(e.key)) target = enabledIndexes[(position + 1) % count];
    else if (PREV_KEYS.includes(e.key)) target = enabledIndexes[(position - 1 + count) % count];
    else if (e.key === 'Home') target = enabledIndexes[0];
    else if (e.key === 'End') target = enabledIndexes[count - 1];
    if (target === undefined) return;

    e.preventDefault();
    optionRefs.current[target]?.focus();
    if (options[target].value !== value) onValueChange(options[target].value);
  };

  return (
    <div role="radiogroup" className={`flex p-0.5 rounded-md bg-gray-100 ${className}`} {...rest}>
      {options.map((option, index) => {
        const checked = option.value === value;
        // 선택된 항목이 없으면 첫 활성 항목으로 들어올 수 있게 함
        const tabbable = hasChecked ? checked : index === enabledIndexes[0];

        return (
          <button
            key={option.value}
            ref={el => {
              optionRefs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={tabbable ? 0 : -1}
            disabled={option.disabled}
            onClick={() => !checked && onValueChange(option.value)}
            onKeyDown={e => handleKeyDown(e, index)}
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

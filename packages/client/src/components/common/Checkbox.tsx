import CheckSvg from '@/assets/checkbox-blue.svg?react';

interface ICheckbox {
  label: string;
  isChecked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Checkbox({ label = 'checkbox', isChecked = false, onChange, ...props }: ICheckbox) {
  return (
    <label htmlFor={'checkbox-' + label} className="flex flex-row items-center gap-3 text-md ">
      <div className="relative w-5 h-5">
        <input
          id={'checkbox-' + label}
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
          className={`
            appearance-none w-5 h-5 rounded-sm border cursor-pointer transition-colors
            ${isChecked ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-400'}
          `}
          {...props}
        />
        {isChecked && <CheckSvg className="absolute inset-0 m-auto w-4 h-4 pointer-events-none text-white" />}
      </div>
      <span className={isChecked ? 'text-blue-500' : 'text-gray-700'}>{label}</span>
    </label>
  );
}

export default Checkbox;

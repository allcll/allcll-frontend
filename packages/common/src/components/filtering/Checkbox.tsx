import CheckSvg from '@/assets/checkbox-blue.svg?react';

interface ICheckbox extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Checkbox({ label = 'checkbox', ...props }: Readonly<ICheckbox>) {
  return (
    <label htmlFor={'checkbox-' + label} className="flex flex-row items-center gap-3 text-md ">
      <div className="relative w-5 h-5">
        <input
          id={'checkbox-' + label}
          type="checkbox"
          className={`
            appearance-none w-5 h-5 rounded-sm border cursor-pointer transition-colors
            ${props.checked ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-400'}
          `}
          {...props}
        />
        {props.checked && <CheckSvg className="absolute inset-0 m-auto w-4 h-4 pointer-events-none text-white" />}
      </div>
      <span className={props.checked ? 'text-blue-500' : 'text-gray-700'}>{label}</span>
    </label>
  );
}

export default Checkbox;

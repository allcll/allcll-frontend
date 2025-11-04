import CheckSvg from '@/assets/checkbox-blue.svg?react';

interface ICheckbox extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

function Checkbox({ label, ...rest }: Readonly<ICheckbox>) {
  return (
    <label htmlFor={'checkbox-' + label} className="flex flex-row items-center gap-3 text-md ">
      <div className="relative w-5 h-5">
        <input
          id={'checkbox-' + label}
          type="checkbox"
          aria-checked={rest.checked}
          className={`
            appearance-none w-5 h-5 rounded-sm border cursor-pointer transition-colors hover:bg-gray-50
            ${rest.checked ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-400'}
          `}
          {...rest}
        />
        {rest.checked && <CheckSvg className="absolute inset-0 m-auto w-4 h-4 pointer-events-none text-white" />}
      </div>
      {label && (
        <span className={`${rest.checked ? 'text-blue-500' : 'text-gray-600'} cursor-pointer hover:text-gray-400`}>
          {label}
        </span>
      )}
    </label>
  );
}

export default Checkbox;

import { InputHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

function TextField({ label, required, id, ...rest }: TextFieldProps) {
  return (
    <div className="h-12 w-full flex flex-col border-b border-gray-200">
      {label && (
        <label
          htmlFor={id}
          className={`text-xs  text-gray-400 after:ml-0.5 ${required ? 'after:content-["*"] after:text-red-500' : ''}`}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        required={required}
        {...rest}
        className="text-[16px] placeholder:text-gray-400 placeholder:text-sm w-full p-2 "
      />
    </div>
  );
}

export default TextField;

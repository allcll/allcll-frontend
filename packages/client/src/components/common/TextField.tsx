import { InputHTMLAttributes } from 'react';

interface ITextField extends InputHTMLAttributes<HTMLInputElement> {
  onDelete: () => void;
}

function TextField({ onDelete, required, ...props }: ITextField) {
  return (
    <div className="h-12 w-full flex border-gray-200 border-b">
      <label
        htmlFor={props.id}
        className={`after:ml-0.5 ${required ? 'after:content-["*"] after:text-red-500' : ''}`}
      />
      <input
        id={props.id}
        type="text"
        required={required}
        {...props}
        className="placeholder:text-gray-400 w-full p-2"
      />
    </div>
  );
}
export default TextField;

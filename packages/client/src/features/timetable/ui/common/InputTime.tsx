import { InputHTMLAttributes } from 'react';

interface IInputTime extends InputHTMLAttributes<HTMLInputElement> {
  value?: string;
}

function InputTime({ className, onChange, ...props }: IInputTime) {
  return (
    <input
      type="time"
      className={'px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:outline-blue-500 ' + className}
      placeholder="HH:MM"
      step={10 * 60} // 10 minutes step
      onChange={e => {
        e.target.value = reconcileTime(e.target.value);
        console.log('Time changed:', e.target.value);
        if (onChange) onChange(e);
      }}
      {...props}
    />
  );
}

function reconcileTime(value: string) {
  const [hours, minutes] = value.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return '00:00';
  }

  const min = (Math.round(minutes / 10) % 6) * 10;

  const normalizedHours = String(hours).padStart(2, '0');
  const normalizedMinutes = String(min).padStart(2, '0');
  return `${normalizedHours}:${normalizedMinutes}`;
}

export default InputTime;

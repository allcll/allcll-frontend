import { useState } from 'react';

const useInputs = <T extends object>(initialValue: T) => {
  const [values, setValues] = useState<T>(initialValue);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = event.target;

    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value,
    }));
  };

  return { values, onChange, setValues };
};
export default useInputs;

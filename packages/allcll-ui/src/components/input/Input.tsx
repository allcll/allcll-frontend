import { useRef, type InputHTMLAttributes } from 'react';
import IconButton from '../icon-button/IconButton';
import SearchSvg from '@/assets/search.svg?react';
import DeleteSVG from '@/assets/x-gray.svg?react';

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  onDelete?: () => void;
}

export function Input({ className = '', onDelete, ...rest }: IInput) {
  const ref = useRef<HTMLInputElement | null>(null);

  return (
    <div className="relative flex items-center w-full">
      <IconButton
        label="검색"
        variant="plain"
        icon={<SearchSvg />}
        className="absolute left-3 top-3 text-gray-500"
        onClick={e => {
          e.preventDefault();
          ref.current?.focus();
        }}
      />
      <input
        ref={ref}
        type="text"
        className={'pl-10 pr-6 py-2 rounded-md w-full bg-white border border-gray-300 ' + (className ?? '')}
        {...rest}
      />
      <IconButton
        label="입력 내용 삭제"
        variant="plain"
        icon={<DeleteSVG className="w-3 h-3" />}
        className="absolute right-3 top-4 text-gray-500"
        onClick={e => {
          e.preventDefault();
          onDelete?.();
          ref.current?.focus();
        }}
      />
    </div>
  );
}

export default Input;

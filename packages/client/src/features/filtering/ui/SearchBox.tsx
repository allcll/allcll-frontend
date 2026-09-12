import { InputHTMLAttributes, useRef } from 'react';
import { CloseIcon, SearchIcon } from '@allcll/allcll-ui';
import { IconButton, Input } from '@allcll/allcll-ui';

interface ISearchBox extends InputHTMLAttributes<HTMLInputElement> {
  onDelete: () => void;
}

function SearchBox({ onDelete, ...props }: ISearchBox) {
  const ref = useRef<HTMLInputElement | null>(null);
  return (
    <Input
      leftIcon={
        <IconButton
          variant="plain"
          icon={<SearchIcon className="w-5 h-5 text-gray-400" />}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          onClick={e => {
            e.preventDefault();
            ref.current?.focus();
          }}
        />
      }
      rightIcon={
        <IconButton
          variant="plain"
          icon={<CloseIcon className="w-5 h-5 text-gray-400" />}
          aria-label="입력 내용 삭제"
          className="absolute right-3 top-1/2 -translate-y-1/2"
          onClick={() => {
            onDelete();
            ref.current?.focus();
          }}
        />
      }
      {...props}
    />
  );
}

export default SearchBox;

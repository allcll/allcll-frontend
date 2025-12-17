import { InputHTMLAttributes, useRef } from 'react';
import DeleteSVG from '@/assets/x-gray.svg?react';
import SearchSvg from '@/assets/search.svg?react';
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
          icon={<SearchSvg className="w-5 h-5" />}
          className="absolute left-3 top-3"
          onClick={e => {
            e.preventDefault();
            ref.current?.focus();
          }}
        />
      }
      rightIcon={
        <IconButton
          variant="plain"
          icon={<DeleteSVG className="w-5 h-5" />}
          aria-label="입력 내용 삭제"
          className="absolute right-3 top-4"
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

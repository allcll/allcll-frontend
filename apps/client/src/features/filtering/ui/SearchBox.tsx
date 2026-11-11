import { InputHTMLAttributes, useRef } from 'react';
import { CloseIcon, SearchIcon, IconButton, Input } from '@allcll/allcll-ui';

interface ISearchBox extends InputHTMLAttributes<HTMLInputElement> {
  onDelete: () => void;
}

function SearchBox({ onDelete, ...props }: ISearchBox) {
  const ref = useRef<HTMLInputElement | null>(null);
  return (
    <Input
      leftIcon={
        <IconButton
          size="medium"
          variant="plain"
          label="검색창으로 이동"
          icon={<SearchIcon className="text-gray-400" />}
          onClick={e => {
            e.preventDefault();
            ref.current?.focus();
          }}
        />
      }
      rightIcon={
        props.value ? (
          <IconButton
            size="medium"
            variant="plain"
            icon={<CloseIcon className="text-gray-400" />}
            label="입력 내용 삭제"
            onClick={() => {
              onDelete();
              ref.current?.focus();
            }}
          />
        ) : undefined
      }
      ref={ref}
      {...props}
    />
  );
}

export default SearchBox;

import { useEffect, useState } from 'react';
import { Chip, ListboxOption, SupportingText } from '@allcll/allcll-ui';
import SearchSvg from '@/assets/search.svg?react';
import { getNormalizedKeyword } from '@/shared/lib/search';

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string | null;
  placeholder?: string;
  options: SelectOption[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
}

function CustomSelect({
  value,
  placeholder,
  options,
  isOpen,
  onToggle,
  onSelect,
  searchable,
  searchPlaceholder = '검색',
}: CustomSelectProps) {
  const label = (value ? options.find(option => option.value === value)?.label : null) ?? placeholder ?? '';
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  const filteredOptions =
    searchable && query
      ? options.filter(option => getNormalizedKeyword(option.label).includes(getNormalizedKeyword(query)))
      : options;

  return (
    <div>
      <Chip label={label} selected={isOpen} variant="select" isChipOpen={isOpen} onClick={onToggle} />
      {isOpen && (
        <div className="mt-1 border border-gray-200 rounded-md overflow-hidden">
          {searchable && (
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
              <SearchSvg className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full text-sm outline-none bg-transparent placeholder:text-gray-400"
              />
            </div>
          )}
          <div className="max-h-48 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <ListboxOption
                  key={option.value}
                  selected={option.value === value}
                  left={<span>{option.label}</span>}
                  onSelect={() => onSelect(option.value)}
                />
              ))
            ) : (
              <SupportingText className="text-center py-3">검색 결과가 없습니다.</SupportingText>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomSelect;

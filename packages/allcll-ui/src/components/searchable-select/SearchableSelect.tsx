import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { CheckmarkIcon, ChevronDownIcon, SearchIcon } from '../../icons';
import EmptyState from '../empty-state/EmptyState';
import Listbox from '../listbox/Listbox';
import ListboxOption from '../listbox/ListboxOption';
import { Z_INDEX } from '../../../zIndex';
import { FIELD_CLASS } from '../../config';

export interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string | null | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  emptyDescription?: string;
  filterOption?: (option: SearchableSelectOption, query: string) => boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

const PANEL_GAP = 4;
const PANEL_MAX_HEIGHT = 320;
const MIN_SPACE_BELOW = 200;

function defaultFilterOption(option: SearchableSelectOption, query: string) {
  const normalize = (text: string) => text.replace(/\s+/g, '').toLowerCase();
  return normalize(option.label).includes(normalize(query));
}

function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = '선택해주세요',
  searchPlaceholder = '검색',
  emptyMessage = '검색 결과가 없습니다.',
  emptyDescription,
  filterOption = defaultFilterOption,
  disabled,
  id,
  className = '',
  'aria-label': ariaLabel,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});
  const [container, setContainer] = useState<HTMLElement | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const selectedOption = options.find(option => option.value === value);
  const filteredOptions = useMemo(
    () => (query ? options.filter(option => filterOption(option, query)) : options),
    [options, query, filterOption],
  );
  const getOptionId = (index: number) => `${listboxId}-option-${index}`;

  const open = () => {
    if (disabled) return;
    // 네이티브 <dialog>는 top layer라서 body로 portal할 경우 패널이 그 뒤에 가려지고 클릭도 막히기 때문에 해당 Dialog로 portal
    setContainer(triggerRef.current?.closest('dialog') ?? document.body);
    setActiveIndex(options.findIndex(option => option.value === value));
    setIsOpen(true);
  };

  const close = useCallback((restoreFocus = true) => {
    setIsOpen(false);
    setQuery('');
    setActiveIndex(-1);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  const handleSelect = (option: SearchableSelectOption) => {
    onChange(option.value);
    close();
  };

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - PANEL_GAP;
    const spaceAbove = rect.top - PANEL_GAP;
    const openUpward = spaceBelow < MIN_SPACE_BELOW && spaceAbove > spaceBelow;

    setPanelStyle({
      left: rect.left,
      width: rect.width,
      maxHeight: Math.min(PANEL_MAX_HEIGHT, (openUpward ? spaceAbove : spaceBelow) - 8),
      ...(openUpward ? { bottom: window.innerHeight - rect.top + PANEL_GAP } : { top: rect.bottom + PANEL_GAP }),
    });
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;

    updatePosition();
    window.addEventListener('resize', updatePosition);

    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus({ preventScroll: true });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      close(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    document.getElementById(getOptionId(activeIndex))?.scrollIntoView({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeIndex]);

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      open();
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const count = filteredOptions.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(index => (count === 0 ? -1 : (index + 1) % count));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(index => (count === 0 ? -1 : index <= 0 ? count - 1 : index - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[activeIndex]) handleSelect(filteredOptions[activeIndex]);
        break;
      case 'Escape':
        // 감싸고 있는 Dialog의 닫기까지 번지지 않게 막음
        e.preventDefault();
        e.stopPropagation();
        close();
        break;
      case 'Tab':
        close(false);
        break;
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleTriggerKeyDown}
        className={`w-full h-full text-left truncate pl-3 pr-8 aria-expanded:border-primary-500 ${FIELD_CLASS}`}
      >
        {selectedOption ? selectedOption.label : <span className="text-gray-400">{placeholder}</span>}
      </button>
      <ChevronDownIcon
        aria-hidden="true"
        className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
      />

      {isOpen &&
        container &&
        createPortal(
          <div
            ref={panelRef}
            className="fixed flex flex-col bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden"
            style={{ ...panelStyle, zIndex: Z_INDEX.dropdown }}
          >
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 shrink-0">
              <SearchIcon aria-hidden="true" className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded={true}
                aria-controls={listboxId}
                aria-autocomplete="list"
                aria-activedescendant={filteredOptions[activeIndex] ? getOptionId(activeIndex) : undefined}
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder={searchPlaceholder}
                className="w-full text-base sm:text-sm outline-none bg-transparent placeholder:text-gray-400"
              />
            </div>

            <Listbox id={listboxId}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <ListboxOption
                    key={option.value}
                    id={getOptionId(index)}
                    selected={option.value === value}
                    active={index === activeIndex}
                    focusable={false}
                    left={<span>{option.label}</span>}
                    right={<CheckmarkIcon className="w-4 h-4 shrink-0 text-primary-500" />}
                    onSelect={() => handleSelect(option)}
                  />
                ))
              ) : (
                <EmptyState icon={SearchIcon} title={emptyMessage} description={emptyDescription} className="py-6" />
              )}
            </Listbox>
          </div>,
          container,
        )}
    </div>
  );
}

export default SearchableSelect;

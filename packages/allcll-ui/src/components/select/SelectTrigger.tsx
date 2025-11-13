import PopoverTrigger from '../popover/popover-trigger/PopoverTrigger';
import { usePopoverContext } from '../popover/popover/Popover';

function SelectTrigger({ children }: { children: React.ReactNode }) {
  const popover = usePopoverContext();

  return <PopoverTrigger aria-haspopup="listbox" aria-expanded={popover.open} label={String(children)} />;
}

export default SelectTrigger;

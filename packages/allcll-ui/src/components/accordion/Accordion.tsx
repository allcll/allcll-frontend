import type { ReactNode } from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '../../icons';

interface AccordionProps {
  value: string | null;
  onValueChange: (value: string | null) => void;
  children: ReactNode;
  className?: string;
}

function AccordionRoot({ value, onValueChange, children, className = '' }: AccordionProps) {
  return (
    <RadixAccordion.Root
      type="single"
      collapsible
      value={value ?? ''}
      onValueChange={nextValue => onValueChange(nextValue || null)}
      className={`flex flex-col gap-3 ${className}`}
    >
      {children}
    </RadixAccordion.Root>
  );
}

interface AccordionItemProps {
  value: string;
  title: ReactNode;
  children: ReactNode;
  id?: string;
}

function AccordionItem({ value, title, children, id }: AccordionItemProps) {
  return (
    <RadixAccordion.Item value={value} id={id} className="rounded-md bg-white shadow-sm">
      <RadixAccordion.Header>
        <RadixAccordion.Trigger className="group flex items-center justify-between gap-3 w-full p-4 rounded-md text-left font-semibold hover:bg-primary-50 data-[state=open]:font-bold data-[state=open]:text-primary-600">
          {title}
          <ChevronDownIcon
            aria-hidden="true"
            className="w-4 h-4 shrink-0 text-gray-400 transition-transform duration-150 group-data-[state=open]:rotate-180"
          />
        </RadixAccordion.Trigger>
      </RadixAccordion.Header>
      <RadixAccordion.Content className="p-4 border-t border-gray-200 text-sm">{children}</RadixAccordion.Content>
    </RadixAccordion.Item>
  );
}

const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
});

export default Accordion;

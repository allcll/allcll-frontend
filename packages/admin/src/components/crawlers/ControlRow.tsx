import { useId } from 'react';
import { Flex, Label, Toggle } from '@allcll/allcll-ui';

interface ControlRowProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export default function ControlRow({ label, checked, onToggle }: ControlRowProps) {
  const toggleId = useId();

  return (
    <Flex justify="between" align="center" className="w-full">
      <Label htmlFor={toggleId}>{label}</Label>
      <Toggle id={toggleId} checked={checked} onCheckedChange={() => onToggle()} />
    </Flex>
  );
}

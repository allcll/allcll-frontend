import { Flex, Label, Toggle } from '@allcll/allcll-ui';

interface ControlRowProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export default function ControlRow({ label, checked, onToggle }: ControlRowProps) {
  return (
    <Flex justify="justify-between" align="items-center" className="w-full">
      <Label>{label}</Label>
      <Toggle checked={checked} onChange={onToggle} />
    </Flex>
  );
}

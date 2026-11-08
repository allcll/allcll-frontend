import { Flex, Label, Toggle } from '@allcll/allcll-ui';

interface ControlRowProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export default function ControlRow({ label, checked, onToggle }: ControlRowProps) {
  return (
    <Flex justify="between" align="center" className="w-full">
      <Label>{label}</Label>
      <Toggle checked={checked} onCheckedChange={() => onToggle()} />
    </Flex>
  );
}

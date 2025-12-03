import Toggle from '../common/Toggle';

interface ControlRowProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export default function ControlRow({ label, checked, onToggle }: ControlRowProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-700">{label}</span>
      <Toggle checked={checked} onChange={onToggle} />
    </div>
  );
}

import PinSvg from '@/assets/pin.svg?react';

interface IconProps {
  disabled?: boolean;
}
const PinIcon = ({ disabled=false }: IconProps) => {
  const color = disabled ? "#9CA3AF" : "#007AFF";
  return <PinSvg fill={color} />;
};

export default PinIcon;
import PinSvg from '@/assets/pin.svg?react';

interface IconProps {
  className?: string;
  disabled?: boolean;
}
const PinIcon = ({ className, disabled=false }: IconProps) => {
  const color = disabled ? "#9CA3AF" : "#007AFF";
  return <PinSvg className={className} fill={color} />;
};

export default PinIcon;
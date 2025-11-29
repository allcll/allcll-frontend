import RowMain from './RowMain';
import RowLeft from './RowLeft';
import RowCenter from './RowCenter';
import RowRight from './RowRight';

interface RowSlotsProps {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
  className?: string;
  withPadding?: boolean;
}

function RowSlots({ left, center, right, className, withPadding }: RowSlotsProps) {
  return (
    <RowMain
      className={className}
      withPadding={withPadding}
      left={<RowLeft>{left}</RowLeft>}
      center={<RowCenter>{center}</RowCenter>}
      right={<RowRight>{right}</RowRight>}
    />
  );
}

export default RowSlots;

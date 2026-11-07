import { CloseIcon, InfoIcon, WarningIcon } from '../../icons';
import IconButton from '../icon-button/IconButton';
import RowSlots from '../row/RowSlots';
import Container from '../container/Container';

type BannerVariant = 'info' | 'danger';

interface IBanner {
  variant?: BannerVariant;
  children: React.ReactNode;
  onClose: () => void;
}

const BANNER_STYLE = {
  info: { container: 'bg-primary-100 border-b border-primary-200', icon: InfoIcon, iconColor: 'text-primary-500' },
  danger: { container: 'bg-danger-100 border-b border-danger-200', icon: WarningIcon, iconColor: 'text-danger-500' },
} satisfies Record<BannerVariant, object>;

function Banner({ variant = 'info', children, onClose }: IBanner) {
  const { container, icon: Icon, iconColor } = BANNER_STYLE[variant];

  return (
    <div className={container}>
      <Container>
        <RowSlots
          className="items-center py-3"
          left={<Icon className={`w-4 h-4 ${iconColor}`} />}
          center={<span className="block text-xs leading-5">{children}</span>}
          right={
            <IconButton
              label="알림 닫기"
              variant="plain"
              icon={<CloseIcon className="text-gray-500 w-4 h-4" />}
              onClick={onClose}
              className="rounded-full"
            />
          }
        />
      </Container>
    </div>
  );
}

export default Banner;

import { CloseIcon, InfoIcon, WarningIcon } from '../../icons';
import IconButton from '../icon-button/IconButton';
import Container from '../container/Container';
import Flex from '../flex/Flex';

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
        <Flex align="center" gap={3} className="py-3">
          <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
          <span className="flex-1 text-xs leading-5">{children}</span>
          <IconButton
            size="medium"
            label="알림 닫기"
            variant="plain"
            icon={<CloseIcon className="text-gray-500" />}
            onClick={onClose}
            className="rounded-full shrink-0"
          />
        </Flex>
      </Container>
    </div>
  );
}

export default Banner;

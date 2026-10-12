import { CloseIcon, WarningIcon } from '../../icons';
import IconButton from '../icon-button/IconButton';
import RowSlots from '../row/RowSlots';

type BannerVariant = 'warning' | 'info';

interface IBanner {
  variant?: BannerVariant;
  children: React.ReactNode;
  deleteBanner: () => void;
}

function Banner({ variant = 'info', children, deleteBanner }: IBanner) {
  const bannerColorClass = getBannerColor(variant);

  return (
    <RowSlots
      withPadding
      className={`${bannerColorClass} items-center`}
      left={<WarningIcon className="text-gray-500 w-4 h-4" />}
      center={<span className="block text-xs leading-5">{children}</span>}
      right={
        <IconButton
          label="알림 닫기"
          variant="plain"
          icon={<CloseIcon className="text-gray-500 w-5 h-5" />}
          onClick={deleteBanner}
          className="rounded-full"
        />
      }
    />
  );
}

export default Banner;

function getBannerColor(variant: BannerVariant) {
  switch (variant) {
    case 'warning':
      return 'bg-danger-100';
    case 'info':
      return 'bg-primary-100';
    default:
      return 'bg-gray-100';
  }
}

import AlertSvg from '@/assets/alert.svg?react';
import CloseSvg from '@/assets/x.svg?react';
import IconButton from '../icon-button/IconButton';
import Row from '../row/Row';

type BannerVariant = 'warning' | 'info';

type IBanner = Readonly<{
  variant?: BannerVariant;
  children: React.ReactNode;
  deleteBanner: () => void;
}>;

function Banner({ variant, children, deleteBanner }: IBanner) {
  const bannerColorClass = getBannerColor(variant ?? 'info');

  return (
    <Row className={`${bannerColorClass} items-center`} withPadding>
      <Row.Left>
        <AlertSvg className="text-gray-500 w-4 h-4" />
      </Row.Left>

      <Row.Center>
        <span className="text-xs">{children}</span>
      </Row.Center>

      <Row.Right>
        <IconButton
          label="알림 닫기"
          variant="plain"
          icon={<CloseSvg className="text-gray-500 w-5 h-5" />}
          onClick={deleteBanner}
          className="rounded-full"
        />
      </Row.Right>
    </Row>
  );
}

export default Banner;

function getBannerColor(variant: BannerVariant) {
  switch (variant) {
    case 'warning':
      return 'bg-secondary-100';
    case 'info':
      return 'bg-blue-100';
    default:
      return 'bg-gray-100';
  }
}

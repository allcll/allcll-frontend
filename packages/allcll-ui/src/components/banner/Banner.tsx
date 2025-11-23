import ImportantSvg from '@/assets/important.svg?react';
import CloseSvg from '@/assets/x-gray.svg?react';

type BannerVariant = 'warning' | 'info';

type IBanner = Readonly<{
  variant?: BannerVariant;
  children: React.ReactNode;
  deleteBanner: () => void;
}>;

function Banner({ variant, children, deleteBanner }: IBanner) {
  const bannerColorClass = getBannerColor(variant ?? 'info');

  return (
    <div className={`flex items-center justify-between px-4 py-2 gap-2 ${bannerColorClass}`}>
      <ImportantSvg className="w-4 h-4" />
      <div className="flex-auto text-xs">{children}</div>
      <button className="p-1 rounded-full hover:bg-blue-200" onClick={deleteBanner} aria-label="알림 닫기">
        <CloseSvg className="" />
      </button>
    </div>
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

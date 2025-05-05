import React from 'react';
import ImportantSvg from '@/assets/important.svg?react';
import CloseSvg from '@/assets/x-gray.svg?react';
import useBannerNotification from '@/store/useBannerNotification.tsx';

function BannerNotification() {
  const banner = useBannerNotification(state => state.banner);
  const closeBanner = useBannerNotification(state => state.closeBanner);

  return <div>{banner && <Banner deleteBanner={closeBanner}>{banner}</Banner>}</div>;
}

interface IBanner {
  children: React.ReactNode;
  deleteBanner: () => void;
}

function Banner({ children, deleteBanner }: IBanner) {
  return (
    <div className="flex items-center justify-between bg-blue-100 px-4 py-2 gap-2">
      <ImportantSvg className="w-4 h-4" />
      <div className="flex-auto text-xs">{children}</div>
      <button className="p-1 rounded-full hover:bg-blue-200" onClick={deleteBanner} aria-label="알림 닫기">
        <CloseSvg className="" />
      </button>
    </div>
  );
}

export default BannerNotification;

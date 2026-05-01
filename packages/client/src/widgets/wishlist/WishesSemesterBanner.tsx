import { useState } from 'react';
import { Banner } from '@allcll/allcll-ui';
import type { IWishesInfo } from '@/shared/model/types';

interface IWishesSemesterBannerProps {
  wishesInfo: IWishesInfo;
}

function WishesSemesterBanner({ wishesInfo }: IWishesSemesterBannerProps) {
  const [showBanner, setShowBanner] = useState(true);

  if (!wishesInfo.isPastSemester || !showBanner) return null;

  return (
    <Banner variant="warning" deleteBanner={() => setShowBanner(false)}>
      {wishesInfo.semesterValue}학기의 과목 입니다. 수강 신청에 유의해주세요.
    </Banner>
  );
}

export default WishesSemesterBanner;

import { useState } from 'react';
import { Banner } from '@allcll/allcll-ui';
import { WishesInfo } from '@/shared/model/types';

interface WishesSemesterBannerProps {
  wishesInfo: WishesInfo;
}

function WishesSemesterBanner({ wishesInfo }: WishesSemesterBannerProps) {
  const [showBanner, setShowBanner] = useState(true);

  if (!wishesInfo.isLastSemesterWish || !showBanner) return null;

  return (
    <Banner variant="warning" deleteBanner={() => setShowBanner(false)}>
      {wishesInfo.semesterValue}학기의 과목 입니다. 수강 신청에 유의해주세요.
    </Banner>
  );
}

export default WishesSemesterBanner;

import useBannerNotification from '@/store/useBannerNotification.tsx';
import { Banner } from '@allcll/allcll-ui';

function BannerNotification() {
  const banner = useBannerNotification(state => state.banner);
  const closeBanner = useBannerNotification(state => state.closeBanner);

  return banner && <Banner deleteBanner={closeBanner}>{banner}</Banner>;
}

export default BannerNotification;

import { Helmet } from 'react-helmet';
import { Outlet } from 'react-router-dom';
import Header from '@/shared/ui/Header.tsx';
import BannerNotification from '@/features/notification/ui/BannerNotification.tsx';
import ToastNotification from '@/features/notification/ui/ToastNotification.tsx';
import Footer from '@/shared/ui/Footer.tsx';
import useGlobalEffect from '@/shared/lib/useGlobalEffect.ts';

function MainLayout() {
  useGlobalEffect();

  return (
    <>
      <Helmet>
        <title>올클(ALLCLL) | 세종대 수강신청 도우미</title>
      </Helmet>

      <ToastNotification />
      <Header />
      <BannerNotification />
      <Outlet />
      <Footer />
    </>
  );
}

export default MainLayout;

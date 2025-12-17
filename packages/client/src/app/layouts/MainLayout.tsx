import { Helmet } from 'react-helmet';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header.tsx';
import BannerNotification from '@/features/notification/ui/BannerNotification.tsx';
import ToastNotification from '@/features/notification/ui/ToastNotification.tsx';
import Footer from '@/components/Footer.tsx';
import useGlobalEffect from '@/hooks/useGlobalEffect.ts';

function MainLayout() {
  useGlobalEffect();

  return (
    <>
      <Helmet>
        <title>ALLCLL</title>
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

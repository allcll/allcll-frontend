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
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>ALLCLL</title>
      </Helmet>

      <ToastNotification />
      <Header />
      <BannerNotification />
      <Outlet />
      <Footer />
    </div>
  );
}

export default MainLayout;

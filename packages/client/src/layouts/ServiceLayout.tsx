import useGlobalEffect from '@/hooks/useGlobalEffect.ts';
import ToastNotification from '@/components/toast/ToastNotification.tsx';
import Header from '@/components/Header.tsx';
import BannerNotification from '@/components/banner/BannerNotification.tsx';
import { Outlet } from 'react-router-dom';
import Footer from '@/components/Footer.tsx';
import ServiceEnabled from '@/components/ServiceEnabled.tsx';

function ServiceLayout() {
  useGlobalEffect();

  return (
    <>
      <ToastNotification />
      <Header />
      <ServiceEnabled>
        <>
          <BannerNotification />
          <Outlet />
        </>
      </ServiceEnabled>
      <Footer />
    </>
  );
}

export default ServiceLayout;

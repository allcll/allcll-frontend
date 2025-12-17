import useGlobalEffect from '@/hooks/useGlobalEffect.ts';
import ToastNotification from '@/features/notification/ui/ToastNotification.tsx';
import Header from '@/components/Header.tsx';
import BannerNotification from '@/features/notification/ui/BannerNotification.tsx';
import { Outlet } from 'react-router-dom';
import Footer from '@/components/Footer.tsx';
import ServiceEnabled from '@/components/ServiceEnabled.tsx';

interface IServiceLayoutProps {
  serviceId: string;
}

function ServiceLayout({ serviceId }: IServiceLayoutProps) {
  useGlobalEffect();

  return (
    <>
      <ToastNotification />
      <Header />
      <ServiceEnabled serviceId={serviceId}>
        <BannerNotification />
        <Outlet />
      </ServiceEnabled>
      <Footer />
    </>
  );
}

export default ServiceLayout;

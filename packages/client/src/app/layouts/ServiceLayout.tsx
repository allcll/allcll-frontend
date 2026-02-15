import useGlobalEffect from '@/shared/lib/useGlobalEffect.ts';
import ToastNotification from '@/features/notification/ui/ToastNotification.tsx';
import Header from '@/shared/ui/Header.tsx';
import BannerNotification from '@/features/notification/ui/BannerNotification.tsx';
import { Outlet } from 'react-router-dom';
import Footer from '@/shared/ui/Footer.tsx';
import ServiceEnabled from '@/entities/semester/ui/ServiceEnabled.tsx';

interface IServiceLayoutProps {
  serviceId: string;
}

function ServiceLayout({ serviceId }: IServiceLayoutProps) {
  useGlobalEffect();

  return (
    <div className="flex min-h-screen flex-col">
      <ToastNotification />
      <Header />
      <ServiceEnabled serviceId={serviceId}>
        <BannerNotification />
        <div className="flex-1">
          <Outlet />
        </div>
      </ServiceEnabled>
      <Footer />
    </div>
  );
}

export default ServiceLayout;

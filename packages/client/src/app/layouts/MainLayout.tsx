import { Helmet } from 'react-helmet';
import { Outlet } from 'react-router-dom';
import Header from '@/shared/ui/Header.tsx';
import BannerNotification from '@/features/notification/ui/BannerNotification.tsx';
import Footer from '@/shared/ui/Footer.tsx';
import useGlobalEffect from '@/shared/lib/useGlobalEffect.ts';
import FeedbackFab from '@/features/feedback/ui/FeedbackFab';
import { GlobalConfirmDialog, ToastNotification } from '@allcll/common';

function MainLayout() {
  useGlobalEffect();

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>올클(ALLCLL) | 세종대 수강신청 도우미</title>
      </Helmet>

      <ToastNotification />
      <GlobalConfirmDialog />
      <Header />
      <BannerNotification />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FeedbackFab />
    </div>
  );
}

export default MainLayout;

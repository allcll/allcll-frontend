import useGlobalEffect from '@/hooks/useGlobalEffect.ts';
import ToastNotification from '@/components/toast/ToastNotification.tsx';
import Header from '@/components/Header.tsx';
// import BannerNotification from '@/components/banner/BannerNotification.tsx';
import { Outlet } from 'react-router-dom';
import Footer from '@/components/Footer.tsx';
// import ServiceEnabled from '@/components/ServiceEnabled.tsx';
import AsideMenu from '@/components/simulation/AsideMenu.tsx';
import SimulationTabs from '@/components/simulation/SimulationTabs.tsx';

function SimulationLayout() {
  useGlobalEffect();

  return (
    <>
      <ToastNotification />
      <Header />
      {/*Fixme: ServiceEnabled 컴포넌트 주석 풀기*/}
      {/*<ServiceEnabled>*/}
      <>
        {/*<BannerNotification />*/}
        <div className="w-full bg-white text-sm text-gray-800 font-sans">
          <div className="flex">
            <AsideMenu />

            <div className="flex-auto min-w-0">
              <SimulationTabs />

              <main className="flex-1 p-4 space-y-4 mx-auto max-w-screen-2xl overflow-x-hidden">
                <Outlet />
              </main>
            </div>
          </div>
        </div>
      </>
      {/*</ServiceEnabled>*/}
      <Footer />
    </>
  );
}

export default SimulationLayout;

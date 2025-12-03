import useGlobalEffect from '@/hooks/useGlobalEffect.ts';
import ToastNotification from '@/components/toast/ToastNotification.tsx';
import Header from '@/components/Header.tsx';
// import BannerNotification from '@/components/banner/BannerNotification.tsx';
import { Outlet } from 'react-router-dom';
import Footer from '@/components/Footer.tsx';
import ServiceEnabled from '@/components/ServiceEnabled.tsx';
import { ASIDE_MENU, SimulationTabList } from '@/utils/simulation/routing.ts';
import SejongUI from '@allcll/sejong-ui';

function SimulationLayout() {
  useGlobalEffect();

  return (
    <>
      <ToastNotification />
      <Header />
      <ServiceEnabled serviceId="simulation">
        {/*<BannerNotification />*/}
        <div className="w-full bg-white text-sm text-gray-800 font-sans">
          <div className="flex">
            <SejongUI.AsideMenu menus={ASIDE_MENU} />

            <div className="flex-auto min-w-0">
              <SejongUI.Tab tabList={SimulationTabList} />

              <main className="flex-1 p-4 space-y-4 mx-auto max-w-screen-2xl overflow-x-hidden">
                <Outlet />
              </main>
            </div>
          </div>
        </div>
      </ServiceEnabled>
      <Footer />
    </>
  );
}

export default SimulationLayout;

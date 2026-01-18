import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import SideNavBar from '@/components/SideNavBar';

function MainLayout() {
  // session 입력하는 기능
  useEffect(() => {
    const session = localStorage.getItem('session');
    if (!session) {
      const inputSession = prompt('어드민 인증 세션을 입력하세요:');
      if (inputSession) {
        localStorage.setItem('session', inputSession);
      }
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>ALLCLL Admin</title>
      </Helmet>

      <div className="flex min-h-screen bg-gray-50">
        <SideNavBar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex min-h-screen bg-gray-50">
            <div className="flex-1 p-6 space-y-6">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainLayout;

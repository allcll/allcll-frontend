import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import SideNavBar from '@/components/SideNavBar';

function MainLayout() {
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
            <div className="flex-1">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainLayout;

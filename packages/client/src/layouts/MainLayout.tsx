import Header from '@/components/Header.tsx';
import Footer from '@/components/Footer.tsx';
import {Outlet} from 'react-router-dom';
import useGlobalEffect from '@/hooks/useGlobalEffect.ts';

function MainLayout() {
  useGlobalEffect();

  return (
    <>
      <Header/>
      <Outlet/>
      <Footer/>
    </>
  );
}

export default MainLayout;

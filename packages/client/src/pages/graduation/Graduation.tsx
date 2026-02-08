import Steps from '@/features/jolup/ui/Steps.tsx';
import { Helmet } from 'react-helmet';

function Graduation() {
  return (
    <>
      <Helmet>
        <title>ALLCLL | 졸업요건검사</title>
        <meta name="description" content="세종대학교 졸업요건검사를 도와드립니다." />
      </Helmet>
      <Steps />
    </>
  );
}

export default Graduation;

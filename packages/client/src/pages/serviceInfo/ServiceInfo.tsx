import { Helmet } from 'react-helmet';
import { useState } from 'react';

function ServiceInfo() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <Helmet>
        <title>ALLCLL | 소개</title>
      </Helmet>

      <div className="mx-auto flex flex-col justify-center bg-blue-100 h-max">
        <iframe
          src="https://resilient-may-c73.notion.site/ebd/1f2acf7c316280939afed2657259c817"
          // allowFullScreen
          width="100%"
          height={isLoaded ? '1000' : '0'}
          onLoad={() => setIsLoaded(true)}
        >
          로드 중…
        </iframe>
        {!isLoaded && (
          <div className="w-4xl mx-auto h-screen flex justify-center items-center text-3xl">로딩 중...</div>
        )}
      </div>
    </>
  );
}

export default ServiceInfo;

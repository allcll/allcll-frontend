import { useState } from 'react';
import { Helmet } from 'react-helmet';
import LoadingWithMessage from '@/shared/ui/Loading';
import { Flex } from '@allcll/allcll-ui';

function ServiceInfo() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <Helmet>
        <title>ALLCLL | 소개</title>
      </Helmet>

      <Flex justify='justify-center' align='items-center' direction='flex-col' className="h-screen bg-blue-100">
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
          <LoadingWithMessage message="페이지를 불러오는 중입니다." />
        )}
      </Flex>
    </>
  );
}

export default ServiceInfo;

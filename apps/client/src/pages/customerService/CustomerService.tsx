import { useState } from 'react';
import { Helmet } from 'react-helmet';
import LoadingWithMessage from '@/shared/ui/Loading';
import { Flex } from '@allcll/allcll-ui';

function CustomerService() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <Helmet>
        <title>ALLCLL | 오류 및 제보</title>
        <meta name="description" content="서비스 이용 중 발생한 오류를 제보하거나, 건의사항을 남겨주세요." />
      </Helmet>

      <Flex justify='justify-center' align='items-center' direction='flex-col' className="h-screen w-full pt-4 bg-blue-100">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSdk7MxNYVyzPyJLecQdJU5wGSgdE7rUWtRfcrPBY2ioKbtW2Q/viewform?embedded=true"
          width="640"
          height={isLoaded ? '1100' : '0'}
          onLoad={() => setIsLoaded(true)}
        >
          로드 중…
        </iframe>
        {!isLoaded && <LoadingWithMessage message="페이지를 불러오는 중입니다." /> }
      </Flex>
    </>
  );
}

export default CustomerService;

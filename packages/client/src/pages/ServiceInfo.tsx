import { useState } from 'react';

function ServiceInfo() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="mx-auto flex flex-col justify-center bg-blue-100 h-max">
      <iframe
        src="https://gleaming-clock-379.notion.site/ebd/191802357b238006b813dc9792c1ce9d"
        // allowFullScreen
        width="100%"
        height={isLoaded ? '1000' : '0'}
        onLoad={() => setIsLoaded(true)}
      >
        로드 중…
      </iframe>
      {!isLoaded && (
        <div className="w-4xl mx-auto h-screen flex justify-center items-center text-3xl">
          로딩 중...
        </div>
      )}
    </div>
  );
}

export default ServiceInfo;
import {useState} from 'react';

function CustomerService() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="mx-auto flex justify-center bg-blue-100 pt-4">
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSdk7MxNYVyzPyJLecQdJU5wGSgdE7rUWtRfcrPBY2ioKbtW2Q/viewform?embedded=true"
        width="640" height={isLoaded ? '1100' : '0'} onLoad={() => setIsLoaded(true)}>로드 중…
      </iframe>
      {!isLoaded && (
        <div className="w-4xl h-screen flex items-center text-3xl">로딩 중...</div>
      )}
    </div>
  );
}

export default CustomerService;
import { useEffect, useState } from 'react';

function useUploading(nextStep: () => void) {
  const [progress, setProgress] = useState(0);
  const message = getMessageForProgress(progress);

  function getMessageForProgress(progress: number): string {
    if (progress < 30) return '파일을 업로드하는 중입니다...';
    if (progress < 70) return '업로드된 파일을 처리하는 중입니다...';
    if (progress < 100) return '최종 검토 중입니다...';
    return '업로드가 완료되었습니다!';
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => {
      nextStep();
      clearInterval(interval);
    };
  }, []);

  return { progress, message };
}

export default useUploading;

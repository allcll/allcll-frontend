import { useEffect, useState } from 'react';

function useMounted({ isOpen }: { isOpen: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
    } else {
      const timer = setTimeout(() => {
        setMounted(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return {
    mounted,
    setMounted,
  };
}

export default useMounted;

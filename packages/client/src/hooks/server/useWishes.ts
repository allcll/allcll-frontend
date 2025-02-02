import { useQuery } from '@tanstack/react-query';
import {Wishlist} from '@/utils/types..ts';

const fetchWishesData = async (): Promise<Wishlist> => {
  const response = await fetch('/api/cart', {
    headers: {
      'Cookie': `sessionId=${document.cookie.split('=')[1]}`,
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

function useWishes() {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishesData,
  });
}

export default useWishes;
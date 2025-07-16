import { useQuery } from '@tanstack/react-query';
import { Wishlist } from '@/utils/types.ts';
import { fetchJsonOnPublic } from '@/utils/api.ts';

const fetchWishesData = async () => {
  return await fetchJsonOnPublic<Wishlist>('/baskets.json');
};

function useWishes() {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishesData,
    staleTime: Infinity,
    select: data => data.baskets,
  });
}

export default useWishes;

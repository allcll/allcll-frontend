import { http, HttpResponse } from 'msw';

export const handlers = [
  // GET /api/cart
  http.get('/api/baskets', async () => {
    const mockCartData = await import('@public-client/baskets.json');
    return HttpResponse.json(mockCartData);
  }),
];

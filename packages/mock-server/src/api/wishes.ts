import {http, HttpResponse} from 'msw';
import {mockCartData} from '../data/wishes.ts';


export const handlers = [
  // GET /api/cart
  http.get('/api/baskets', () => {
    return HttpResponse.json(mockCartData);
  }),
];
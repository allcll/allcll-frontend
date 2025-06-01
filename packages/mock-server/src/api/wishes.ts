import { http, HttpResponse } from 'msw';
import { ISubjects } from '../data/subjects.ts';
import { DataType, getData } from '../data/caching.ts';

export const handlers = [
  // GET /api/cart
  http.get('/api/baskets', async () => {
    const mockCartData = (await getData(DataType.BASKETS)) as ISubjects;
    return HttpResponse.json(mockCartData);
  }),
];

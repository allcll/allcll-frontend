import { http, HttpResponse } from 'msw';
import { DataType, getData } from '../data/caching.ts';
import { ISubjects } from '../data/letures.ts';

export const handlers = [
  http.get('/api/subjects', async () => {
    const mockCartData = (await getData(DataType.LECTURES)) as ISubjects;
    return HttpResponse.json(mockCartData);
  }),
];

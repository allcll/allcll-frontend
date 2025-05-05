import { HttpResponse } from 'msw';
import { TokenNotFoundError } from '../data/errorJson.ts';

// A higher-order response resolver that validates
// the request cookie before proceeding with the actual response resolver.
export function withAuth(resolver) {
  return input => {
    const { request } = input;
    const cookies = request.headers.get('Cookie');

    if (!cookies || !cookies.includes('token=')) {
      return new HttpResponse(JSON.stringify(TokenNotFoundError), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return resolver(input);
  };
}

import { fetchTextOnPublic } from '@/shared/api/api.ts';

export const fetchPrivacyPolicy = async () => {
  return await fetchTextOnPublic('/privacy-policy.md');
};

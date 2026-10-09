import { fetchJsonOnPublic } from '@/shared/api/api.ts';
import { FaqElement } from '@/entities/faq/model/useFaq.ts';

export interface FaqAPIResponse {
  faq: FaqElement[];
}

export const fetchFaq = async () => {
  return await fetchJsonOnPublic<FaqAPIResponse>('/faq.json');
};

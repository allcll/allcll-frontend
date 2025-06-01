import { useQuery } from '@tanstack/react-query';

export interface FaqElement {
  question: string;
  answer: string;
}

interface FaqAPIResponse {
  faq: FaqElement[];
}

function useFaq() {
  return useQuery({
    queryKey: ['faq'],
    queryFn: fetchFaq,
    staleTime: Infinity,
    select: (data: FaqAPIResponse) => data.faq,
  });
}

const fetchFaq = async (): Promise<FaqAPIResponse> => {
  const response = await fetch('/faq.json');

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export default useFaq;

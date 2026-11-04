import { AllcllFaceIcon, Flex } from '@allcll/allcll-ui';
import { MAX_RATE } from '@/hooks/server/useAdminReviews';

function ReviewRate({ rate }: Readonly<{ rate: number }>) {
  return (
    <Flex align="items-center" gap="gap-0.5">
      {Array.from({ length: MAX_RATE }).map((_, i) => (
        <AllcllFaceIcon key={i} mood="smile" className={`h-4 w-4 ${i < rate ? 'text-primary-500' : 'text-gray-300'}`} />
      ))}
    </Flex>
  );
}

export default ReviewRate;

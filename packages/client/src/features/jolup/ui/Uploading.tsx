import useUploading from '@/features/jolup/lib/useUploading';
import { Card, Flex, Heading } from '@allcll/allcll-ui';

import { JolupStepsProps } from '@/features/jolup/model/types.ts';

function Uploading({ nextStep }: JolupStepsProps) {
  const { progress, message } = useUploading(nextStep);

  return (
    <Card variant="outlined" className="w-full mx-auto p-8">
      <Flex direction="flex-col" align="items-center" justify="justify-center" className="py-4 px-4">
        <div className="text-center space-y-2">
          <Heading level={2} size="xxl" className="text-gray-900">
            졸업 요건 검사 중
          </Heading>
        </div>

        <div className="space-y-3 w-full">
          <Flex direction="flex-col" align="items-center" gap="gap-4" className="w-full">
            <p className='text-primary'>
              <span className="text-2xl font-bold">{progress}</span>%
            </p>
            <span className="text-sm font-medium text-gray-500">{message}</span>
          </Flex>

          <div className="w-full bg-gray-100 rounded-sm h-3 overflow-hidden">
            <div
              className="bg-primary h-full rounded-sm transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </Flex>
    </Card>
  );
}

export default Uploading;

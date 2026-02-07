import useUploading from '@/features/jolup/lib/useUploading';
import { Card, Flex, Heading } from '@allcll/allcll-ui';
import type { JolupStepsProps } from '@/features/jolup/ui/Steps.tsx';

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

        <div className="space-y-3">
          <Flex direction="flex-col" justify="justify-between" align="items-end">
            <span className="text-sm font-medium text-gray-500">{message}</span>
          </Flex>

          <Flex justify="justify-center" gap="gap-4">
            <span className="text-xl font-bold text-primary">{progress}%</span>
          </Flex>

          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </Flex>
    </Card>
  );
}

export default Uploading;

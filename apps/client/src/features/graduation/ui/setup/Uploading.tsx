import useUploading from '@/features/graduation/lib/useUploading';
import { Card, Flex, Heading } from '@allcll/allcll-ui';

import { JolupStepsProps } from '@/features/graduation/model/types.ts';
import LoadingWithMessage from '@/shared/ui/Loading';

interface UploadingProps extends JolupStepsProps {
  file: File | null;
}

function Uploading({ nextStep, prevStep, file }: UploadingProps) {
  const { message } = useUploading(nextStep, prevStep, file);

  return (
    <Card variant="outlined" className="w-full mx-auto p-8">
      <Flex direction="flex-col" align="items-center" justify="justify-center" className="py-4 px-4">
        <div className="text-center space-y-2">
          <Heading level={2} size="xxl" className="text-gray-900">
            졸업 요건 검사 중
          </Heading>
          <Flex direction="flex-col" gap="gap-6" className="py-8">
            <LoadingWithMessage message={message} />
          </Flex>
        </div>
      </Flex>
    </Card>
  );
}

export default Uploading;

import useUploading from '@/features/jolup/lib/useUploading';
import { Card, Flex, Heading, SupportingText } from '@allcll/allcll-ui';
import type { JolupStepsProps } from '@/features/jolup/ui/Steps.tsx';

function Uploading({ nextStep }: JolupStepsProps) {
  const { progress, message } = useUploading(nextStep);

  return (
    <Card variant="outlined" className="w-full max-w-2xl mx-auto">
      <Flex direction="flex-col" align="items-center" justify="justify-center" className="py-8 px-4">
        <div className="text-center space-y-2">
          <Heading level={2} size="lg" className="text-gray-900">
            졸업 요건 검사 중
          </Heading>
          <SupportingText className="text-gray-500">
            업로드한 파일을 바탕으로 졸업 요건을 분석하고 있습니다.
          </SupportingText>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-sm font-medium text-gray-700">{message}</span>
            <span className="text-sm font-bold text-primary">{progress}%</span>
          </div>

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

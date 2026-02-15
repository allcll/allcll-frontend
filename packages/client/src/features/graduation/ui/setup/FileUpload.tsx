import { Button, Card, Flex, Heading, SupportingText } from '@allcll/allcll-ui';
import FileDropZone from './FileDropZone';
import { JolupStepsProps } from '@/features/graduation/model/types.ts';

interface FileUploadProps extends JolupStepsProps {
  file: File | null;
  onFileSelected: (file: File | null) => void;
}

function FileUpload({ nextStep, file, onFileSelected }: FileUploadProps) {
  const handleNextStep = () => {
    if (!file) return;
    // 파일 업로드는 useUploading에서 처리
    nextStep();
  };

  return (
    <Card variant="outlined" className="w-full mx-auto p-8">
      <Flex direction="flex-col" gap="gap-6" align="items-center">
        <Flex direction="flex-col" gap="gap-2" align="items-center">
          <Heading level={2} size="xxl">
            파일 업로드
          </Heading>
          <SupportingText>졸업 요건을 확인하기 위해 성적표 파일을 업로드해주세요.</SupportingText>
        </Flex>

        <FileDropZone
          onFileSelect={onFileSelected}
          selectedFile={file}
          onDeleteFile={() => onFileSelected(null)}
          accept=".xlsx"
        />

        <Flex justify="justify-end" gap="gap-3" className="w-full mt-2">
          <Button variant="secondary" size="medium" onClick={() => onFileSelected(null)}>
            취소
          </Button>
          <Button variant="primary" size="medium" onClick={handleNextStep} disabled={!file}>
            다음 단계
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}

export default FileUpload;

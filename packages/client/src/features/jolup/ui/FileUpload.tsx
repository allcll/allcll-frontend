import { JolupStepsProps } from '@/features/jolup/ui/Steps.tsx';
import { useState } from 'react';
import { Button, Card, Flex, Heading, SupportingText } from '@allcll/allcll-ui';
import FileDropZone from './FileDropZone';

function FileUpload({ nextStep }: JolupStepsProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Todo: 파일 업로드 로직 추가
  };

  const handleDeleteFile = () => {
    setSelectedFile(null);
  };

  const handleCancel = () => {
    setSelectedFile(null);
  };

  return (
    <Card variant="outlined" className="w-full max-w-2xl mx-auto p-8">
      <Flex direction="flex-col" gap="gap-6" align="items-center">
        <Flex direction="flex-col" gap="gap-2" align="items-center">
          <Heading level={2} size="xl">
            파일 업로드
          </Heading>
          <SupportingText>졸업 요건을 확인하기 위해 성적표 파일을 업로드해주세요.</SupportingText>
        </Flex>

        <FileDropZone
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
          onDeleteFile={handleDeleteFile}
          accept=".csv, .xls, .xlsx"
        />

        <Flex justify="justify-end" gap="gap-3" className="w-full mt-2">
          <Button variant="secondary" size="medium" onClick={handleCancel}>
            취소
          </Button>
          <Button variant="primary" size="medium" onClick={nextStep} disabled={!selectedFile}>
            다음 단계
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}

export default FileUpload;

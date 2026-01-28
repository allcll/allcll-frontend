import { JolupStepsProps } from '@/features/jolup/ui/Steps.tsx';
import { useRef, useState } from 'react';
import { Button } from '@allcll/allcll-ui';

function FileUpload({ nextStep }: JolupStepsProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // 파일 업로드 로직 추가
      // nextStep();
    }
  };

  return (
    <>
      <input type="file" accept=".csv, .xls, .xlsx" ref={ref} className="hidden" onChange={handleFileChange} />
      <Button
        variant="outlined"
        size="small"
        onClick={() => {
          ref.current?.click();
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        파일 업로드
      </Button>
      {fileName && <p className="mt-2">업로드된 파일: {fileName}</p>}
      <Button onClick={nextStep} variant="text" size="small">
        다음 단계로
      </Button>
    </>
  );
}

export default FileUpload;

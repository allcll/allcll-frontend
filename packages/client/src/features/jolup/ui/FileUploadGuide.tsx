import { Card, Heading, Flex } from '@allcll/allcll-ui';

const FileUploadGuide = () => {
  return (
    <Card variant="outlined" className="w-full max-w-2xl mx-auto p-8 mt-2">
      <Flex direction="flex-col" gap="gap-3">
        <Flex align="items-center" gap="gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
            !
          </div>
          <Heading level={5} size="sm" className="text-gray-800">
            기이수 성적 파일 업로드 방법
          </Heading>
        </Flex>

        <ul className="list-disc list-inside space-y-1 ml-1 text-gray-600">
          <li className="text-sm">
            <span className="text-xs sm:text-sm">
              학교 포털 시스템 접속 후 <strong>[성적] &gt; [전체 성적 조회]</strong> 메뉴로 이동하세요.
            </span>
          </li>
          <li className="text-sm">
            <span className="text-xs sm:text-sm">
              우측 상단의 <strong>[엑셀 다운로드]</strong> 버튼을 클릭하여 파일을 저장하세요.
            </span>
          </li>
          <li className="text-sm">
            <span className="text-xs sm:text-sm">다운로드 받은 엑셀 파일을 수정하지 않고 그대로 업로드해주세요.</span>
          </li>
        </ul>
      </Flex>
    </Card>
  );
};

export default FileUploadGuide;

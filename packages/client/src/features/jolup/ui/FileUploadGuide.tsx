import { Card, Heading, Flex } from '@allcll/allcll-ui';

const FileUploadGuide = () => {
  return (
    <Card variant="outlined" className="w-full mx-auto p-8 mt-2">
      <Flex direction="flex-col" gap="gap-3">
        <Flex align="items-center" gap="gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-100 text-primary flex items-center justify-center text-xs font-bold shrink-0">
            !
          </div>
          <Heading level={3} className="text-gray-800">
            기이수 성적 파일 업로드 방법
          </Heading>
        </Flex>

        <ul className="list-disc list-inside space-y-1 ml-1 text-gray-600">
          <li className="text-sm">
            <span className="text-xs sm:text-sm">
              학사 정보 시스템에 로그인 후 <strong>[학부생 학사정보]</strong> 탭에 접속합니다.
            </span>
          </li>
          <li className="text-sm">
            <span className="text-xs sm:text-sm">
              좌측 사이드 바의 <strong>[수업/성적] &gt; [성적 및 강의평가] &gt; [기이수성적조회]</strong>를 클릭합니다.
            </span>
          </li>
          <li className="text-sm">
            <span className="text-xs sm:text-sm">
              우측 상단의 <strong>[성적 엑셀 다운로드]</strong> 버튼을 클릭하여 파일을 저장하세요.
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

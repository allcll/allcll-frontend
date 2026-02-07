import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Helmet } from 'react-helmet';
import markdownComponents from '@/shared/config/markdownComponents';
import usePrivacyPolicy from '@/entities/privacyPolicy/model/usePrivacyPolicy';
import PrivacyLabelGrid from './PrivacyLabelGrid';
import { Card, Flex, Heading, SupportingText } from '@allcll/allcll-ui';

function PrivacyPolicy() {
  const { data: markdown } = usePrivacyPolicy();

  if (!markdown) return null;

  return (
    <>
      <Helmet>
        <title>ALLCLL | 개인정보 처리방침</title>
        <meta name="description" content="ALLCLL 개인정보 처리방침" />
      </Helmet>
      <div className="max-w-5xl mx-auto px-4 py-4 md:py-12">
        <Flex gap="gap-2" direction="flex-col" className="mb-6">
          <Heading level={1} size="xxl">
            ALLCLL 개인정보 처리방침
          </Heading>
          <SupportingText>
            세종대학교 대양휴머니티칼리지 연동 서비스 이용을 위해 아래와 같이 개인정보를 수집·이용하고자 합니다.
          </SupportingText>
        </Flex>
        <Card variant="outlined">
          <PrivacyLabelGrid />
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {markdown}
          </ReactMarkdown>
        </Card>
      </div>
    </>
  );
}

export default PrivacyPolicy;

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Helmet } from 'react-helmet';
import markdownComponents from '@/shared/config/markdownComponents';
import usePrivacyPolicy from '@/entities/privacyPolicy/model/usePrivacyPolicy';
import PrivacyLabelGrid from '../../widgets/user/ui/PrivacyLabelGrid';
import { Card, LoadingState } from '@allcll/allcll-ui';
import PageContainer from '@/shared/ui/PageContainer';
import PageHeader from '@/shared/ui/PageHeader';

function PrivacyPolicy() {
  const { data: markdown, isLoading } = usePrivacyPolicy();

  if (isLoading) return <LoadingState className="min-h-[50vh]" />;
  if (!markdown) return null;

  return (
    <>
      <Helmet>
        <title>ALLCLL | 개인정보 처리방침</title>
        <meta name="description" content="ALLCLL 개인정보 처리방침" />
      </Helmet>
      <PageContainer>
        <PageHeader
          title="ALLCLL 개인정보 처리방침"
          description="세종대학교 대양휴머니티칼리지 연동 서비스 이용을 위해 아래와 같이 개인정보를 수집·이용하고자 합니다."
        />
        <Card variant="outlined">
          <PrivacyLabelGrid />
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {markdown}
          </ReactMarkdown>
        </Card>
      </PageContainer>
    </>
  );
}

export default PrivacyPolicy;

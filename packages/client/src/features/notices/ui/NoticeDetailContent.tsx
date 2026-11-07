import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Badge, Flex, Heading } from '@allcll/allcll-ui';
import { type Notice, getNoticeLabel } from '@/entities/notices/model/notice';
import { formatDateLong } from '@allcll/common';

function NoticeDetailContent({ notice }: Readonly<{ notice: Notice }>) {
  const date = formatDateLong(notice.createdAt);

  return (
    <Flex direction="flex-col" gap="gap-4">
      <Flex direction="flex-col" gap="gap-2" className="pb-4 border-b border-gray-100">
        <Heading level={3}>{notice.title}</Heading>
        <Flex align="items-center" gap="gap-2">
          <Badge color="primary" size="small">
            {getNoticeLabel(notice.operationType)}
          </Badge>
          <span className="text-xs text-gray-400">{date}</span>
        </Flex>
      </Flex>
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{notice.content}</ReactMarkdown>
      </div>
    </Flex>
  );
}

export default NoticeDetailContent;

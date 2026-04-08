import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Badge, Button, Flex, IconButton } from '@allcll/allcll-ui';
import CloseSvg from '@/assets/x.svg?react';
import ChevronLeftSvg from '@/assets/chevron-left.svg?react';
import { type Notice, getNoticeLabel } from '@/entities/notices/model';
import NoticeCard from './NoticeCard';
import NoticeDetailModal from './NoticeDetailModal';

interface Props {
  notices: Notice[];
  isMobile?: boolean;
  isRead: (id: number) => boolean;
  onRead: (id: number) => void;
  onClose: () => void;
}

function NoticePanel({ notices, isMobile = false, isRead, onRead, onClose }: Props) {
  const [selectedNotice, setSelected] = useState<Notice | null>(null);

  const handleCardClick = (notice: Notice) => {
    onRead(notice.id);
    setSelected(notice);
  };

  if (isMobile && selectedNotice) {
    return (
      <Flex direction="flex-col" className="h-full">
        <Flex align="items-center" justify="justify-between" className="px-4 py-3 border-b border-gray-100">
          <Button variant="text" size="small" textColor="gray" onClick={() => setSelected(null)}>
            <ChevronLeftSvg className="w-4 h-4" />
            목록
          </Button>
          <IconButton variant="plain" label="닫기" icon={<CloseSvg className="w-4 h-4" />} onClick={onClose} />
        </Flex>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          <Flex align="items-center" gap="gap-2">
            <Badge variant="default" size="small">
              {getNoticeLabel(selectedNotice.operationType)}
            </Badge>
            <span className="text-xs text-gray-400">{selectedNotice.createdAt.slice(0, 10).replace(/-/g, '.')}</span>
          </Flex>
          <h2 className="text-base font-semibold text-gray-900">{selectedNotice.title}</h2>
          <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{selectedNotice.content}</ReactMarkdown>
          </div>
        </div>
      </Flex>
    );
  }

  return (
    <Flex direction="flex-col" className="h-full">
      <Flex align="items-center" justify="justify-between" className="px-4 py-3 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-900">공지사항</span>
        <IconButton variant="plain" label="닫기" icon={<CloseSvg className="w-4 h-4" />} onClick={onClose} />
      </Flex>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {notices.length === 0 ? (
          <Flex align="items-center" justify="justify-center" className="h-32 text-sm text-gray-400">
            등록된 공지사항이 없습니다.
          </Flex>
        ) : (
          notices.map(notice => (
            <NoticeCard key={notice.id} notice={notice} isRead={isRead(notice.id)} onClick={handleCardClick} />
          ))
        )}
      </div>

      {selectedNotice && <NoticeDetailModal notice={selectedNotice} onClose={() => setSelected(null)} />}
    </Flex>
  );
}

export default NoticePanel;

import { useState } from 'react';
import { Flex, Heading, IconButton, ChevronLeftIcon, CloseIcon, EmptyState } from '@allcll/allcll-ui';
import { type Notice } from '@/entities/notices/model/notice';
import NoticeCard from './NoticeCard';
import NoticeDetailContent from './NoticeDetailContent';
import NoticeDetailModal from './NoticeDetailModal';

interface NoticePanelProps {
  notices: Notice[];
  isMobile?: boolean;
  isRead: (notice: Notice) => boolean;
  onRead: (notice: Notice) => void;
  onClose: () => void;
}

function NoticePanel({ notices, isMobile = false, isRead, onRead, onClose }: Readonly<NoticePanelProps>) {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const handleCardClick = (notice: Notice) => {
    onRead(notice);
    setSelectedNotice(notice);
  };

  if (isMobile && selectedNotice) {
    return (
      <Flex direction="column" className="h-full">
        <Flex align="center" justify="between" className="px-4 h-14 shrink-0 border-b border-gray-100">
          <Flex align="center" gap={1}>
            <IconButton
              size="large"
              className="p-2 -ml-2 hover:bg-gray-100 active:bg-gray-100"
              variant="plain"
              label="공지 목록으로"
              icon={<ChevronLeftIcon className="text-gray-500" />}
              onClick={() => setSelectedNotice(null)}
            />
            <Heading level={3}>공지사항</Heading>
          </Flex>
          <IconButton
            size="large"
            className="p-2 hover:bg-gray-100 active:bg-gray-100"
            variant="plain"
            label="닫기"
            icon={<CloseIcon className="text-gray-500" />}
            onClick={onClose}
          />
        </Flex>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <NoticeDetailContent notice={selectedNotice} />
        </div>
      </Flex>
    );
  }

  return (
    <Flex direction="column" className="h-full">
      <Flex align="center" justify="between" className="px-4 h-14 shrink-0 border-b border-gray-100">
        <Heading level={3}>공지사항</Heading>
        <IconButton
          size={isMobile ? 'large' : 'medium'}
          className="p-2 hover:bg-gray-100 active:bg-gray-100"
          variant="plain"
          label="닫기"
          icon={<CloseIcon className="text-gray-500" />}
          onClick={onClose}
        />
      </Flex>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {notices.length === 0 ? (
          <EmptyState title="등록된 공지사항이 없습니다." className="h-32" />
        ) : (
          notices.map(notice => (
            <NoticeCard key={notice.id} notice={notice} isRead={isRead(notice)} onClick={handleCardClick} />
          ))
        )}
      </div>

      {selectedNotice && <NoticeDetailModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} />}
    </Flex>
  );
}

export default NoticePanel;

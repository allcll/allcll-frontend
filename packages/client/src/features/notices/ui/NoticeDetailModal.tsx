import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { createPortal } from 'react-dom';
import { Badge, Flex, IconButton } from '@allcll/allcll-ui';
import CloseSvg from '@/assets/x.svg?react';
import { type Notice, getNoticeLabel } from '@/entities/notices/model/notice';

interface NoticeDetailModalProps {
  notice: Notice;
  onClose: () => void;
}

function NoticeDetailModal({ notice, onClose }: Readonly<NoticeDetailModalProps>) {
  const date = notice.createdAt.slice(0, 10).replace(/-/g, '.');

  return createPortal(
    <div
      className="fixed inset-0 z-200 flex items-center justify-center px-4"
      onMouseDown={e => e.nativeEvent.stopImmediatePropagation()}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 cursor-default"
        aria-label="모달 닫기"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="notice-detail-title"
        className="relative z-10 bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden"
      >
        <Flex align="items-center" justify="justify-between" className="px-5 py-4 border-b border-gray-100">
          <Flex align="items-center" gap="gap-2">
            <Badge variant="primary" size="small">
              {getNoticeLabel(notice.operationType)}
            </Badge>
            <span className="text-xs text-gray-400">{date}</span>
          </Flex>
          <IconButton variant="plain" label="닫기" icon={<CloseSvg className="w-4 h-4" />} onClick={onClose} />
        </Flex>

        <div className="px-5 py-4 overflow-y-auto">
          <h2 id="notice-detail-title" className="text-base font-semibold text-gray-900 mb-4">
            {notice.title}
          </h2>
          <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{notice.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default NoticeDetailModal;

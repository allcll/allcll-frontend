import { Badge, Flex } from '@allcll/allcll-ui';
import { type Notice, getNoticeLabel } from '@/entities/notices/model';

interface Props {
  notice: Notice;
  isRead: boolean;
  onClick: (notice: Notice) => void;
}

function NoticeCard({ notice, isRead, onClick }: Props) {
  const date = notice.createdAt.slice(0, 10).replace(/-/g, '.');

  return (
    <button
      type="button"
      onClick={() => onClick(notice)}
      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
    >
      <Flex align="items-start" gap="gap-3">
        <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${isRead ? 'bg-transparent' : 'bg-blue-500'}`} />
        <Flex direction="flex-col" gap="gap-1" className="min-w-0">
          <Flex align="items-center" gap="gap-2">
            <Badge variant="primary" size="small">
              {getNoticeLabel(notice.operationType)}
            </Badge>
            <span className="text-xs text-gray-400">{date}</span>
          </Flex>
          <p className="text-sm text-gray-900 font-medium truncate">{notice.title}</p>
        </Flex>
      </Flex>
    </button>
  );
}

export default NoticeCard;

import {
  Card,
  IconButton,
  Flex,
  EditIcon,
  TrashCanIcon,
  DocumentIcon,
  EmptyState,
  LoadingState,
  Table,
} from '@allcll/allcll-ui';
import OperationTypeBadge from '@/components/common/OperationTypeBadge';
import type { Notice } from '@/hooks/server/useAdminNotices';
import { formatDate } from '@allcll/common';

interface INoticeTableProps {
  notices: Notice[];
  isLoading: boolean;
  isError: boolean;
  onView: (notice: Notice) => void;
  onEdit: (notice: Notice) => void;
  onDelete: (notice: Notice) => void;
}

function NoticeTable({ notices, isLoading, isError, onView, onEdit, onDelete }: INoticeTableProps) {
  return (
    <Card className="overflow-hidden flex flex-col flex-1 min-h-0">
      <Table
        wrapperClassName="flex flex-col flex-1 min-h-0"
        scrollClassName="h-full overflow-y-auto"
        className="table-fixed"
      >
        <Table.Head sticky>
          <Table.HeaderCell align="left" className="w-28">
            카테고리
          </Table.HeaderCell>
          <Table.HeaderCell align="left">제목</Table.HeaderCell>
          <Table.HeaderCell align="left" className="w-32">
            작성일
          </Table.HeaderCell>
          <Table.HeaderCell className="w-24" />
        </Table.Head>
        <Table.Body>
          {isLoading && (
            <tr>
              <td colSpan={4} className="py-8 text-center">
                <LoadingState />
              </td>
            </tr>
          )}
          {!isLoading && isError && (
            <tr>
              <td colSpan={4} className="py-8 text-center text-sm text-danger-500">
                공지사항을 불러오는 데 실패했습니다.
              </td>
            </tr>
          )}
          {!isLoading && !isError && notices.length === 0 && (
            <tr>
              <td colSpan={4} className="py-12 text-center">
                <EmptyState icon={DocumentIcon} title="공지사항이 없습니다." />
              </td>
            </tr>
          )}
          {!isLoading &&
            !isError &&
            notices.map(notice => (
              <Table.Row key={notice.id} className="hover:bg-gray-50 transition-colors">
                <Table.Cell align="left">
                  <OperationTypeBadge operationType={notice.operationType} />
                </Table.Cell>
                <Table.Cell
                  align="left"
                  className="truncate hover:text-primary-500 transition-colors"
                  role="button"
                  tabIndex={0}
                  onClick={() => onView(notice)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onView(notice);
                    }
                  }}
                >
                  {notice.title}
                </Table.Cell>
                <Table.Cell align="left" className="text-gray-500">
                  {formatDate(notice.createdAt)}
                </Table.Cell>
                <Table.Cell>
                  <Flex align="items-center" gap="gap-1">
                    <IconButton
                      icon={<EditIcon className="w-4 h-4" />}
                      label="수정"
                      variant="plain"
                      onClick={() => onEdit(notice)}
                      className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-colors"
                    />
                    <IconButton
                      icon={<TrashCanIcon className="w-4 h-4" />}
                      label="삭제"
                      variant="plain"
                      onClick={() => onDelete(notice)}
                      className="p-1.5 text-gray-400 hover:text-danger-500 hover:bg-danger-50 transition-colors"
                    />
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </Card>
  );
}

export default NoticeTable;

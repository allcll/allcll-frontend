import EditSvg from '@/assets/edit.svg?react';
import TrashSvg from '@/assets/trash.svg?react';
import FileTextSvg from '@/assets/file-text.svg?react';
import { Card, SupportingText, Badge, IconButton, Flex } from '@allcll/allcll-ui';
import { CATEGORY_LABELS, type Notice } from '@/hooks/server/useAdminNotices';

interface Props {
  notices: Notice[];
  isLoading: boolean;
  isError: boolean;
  onView: (notice: Notice) => void;
  onEdit: (notice: Notice) => void;
  onDelete: (notice: Notice) => void;
}

function NoticeTable({ notices, isLoading, isError, onView, onEdit, onDelete }: Props) {
  return (
    <Card className="overflow-hidden flex flex-col flex-1 min-h-0">
      <div className="overflow-y-auto flex-1">
        <table className="w-full border-collapse table-fixed">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gray-50 text-sm text-gray-500">
              <th className="text-left px-4 py-2 font-medium w-28">카테고리</th>
              <th className="text-left px-4 py-2 font-medium">제목</th>
              <th className="text-left px-4 py-2 font-medium w-28">작성일</th>
              <th className="w-24" />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="py-8 text-center">
                  <SupportingText>불러오는 중...</SupportingText>
                </td>
              </tr>
            )}
            {!isLoading && isError && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-red-500">
                  공지사항을 불러오는데 실패했습니다.
                </td>
              </tr>
            )}
            {!isLoading && !isError && notices.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center">
                  <Flex direction="flex-col" align="items-center" gap="gap-2" className="text-gray-400">
                    <FileTextSvg className="w-8 h-8" />
                    <SupportingText>공지사항이 없습니다.</SupportingText>
                  </Flex>
                </td>
              </tr>
            )}
            {!isLoading &&
              !isError &&
              notices.map(notice => (
                <tr key={notice.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Badge variant="primary" size="small">
                      {CATEGORY_LABELS[notice.category]}
                    </Badge>
                  </td>
                  <td
                    className="px-4 py-3 text-sm text-gray-900 truncate cursor-pointer hover:text-blue-500 transition-colors"
                    onClick={() => onView(notice)}
                  >
                    {notice.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {notice.createdAt.slice(0, 10).replace(/-/g, '.')}
                  </td>
                  <td className="px-4 py-3">
                    <Flex align="items-center" gap="gap-1">
                      <IconButton
                        icon={<EditSvg className="w-4 h-4" />}
                        label="수정"
                        variant="plain"
                        onClick={() => onEdit(notice)}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                      />
                      <IconButton
                        icon={<TrashSvg className="w-4 h-4" />}
                        label="삭제"
                        variant="plain"
                        onClick={() => onDelete(notice)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      />
                    </Flex>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default NoticeTable;

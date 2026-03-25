import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlusSvg from '@/assets/plus.svg?react';
import { Button, Flex } from '@allcll/allcll-ui';
import { Filtering, CheckboxAdapter } from '@allcll/common';
import MultiSelectFilterOption from '@/components/common/MultiSelectFilterOption';
import PageHeader from '@/components/common/PageHeader';
import NoticeTable from '@/components/notices/NoticeTable';
import NoticeViewModal from '@/components/notices/NoticeViewModal';
import NoticeDeleteModal from '@/components/notices/NoticeDeleteModal';
import {
  useAdminNotices,
  useDeleteNotice,
  CATEGORY_LABELS,
  NOTICE_CATEGORIES,
  type Notice,
  type NoticeCategory,
} from '@/hooks/server/useAdminNotices';

const CATEGORY_OPTIONS = NOTICE_CATEGORIES.map(value => ({ label: CATEGORY_LABELS[value], value }));

function Notices() {
  const navigate = useNavigate();
  const { data: notices = [], isLoading, isError } = useAdminNotices();
  const { mutate: deleteNotice, isPending: isDeleting } = useDeleteNotice();

  const [selectedCategories, setSelectedCategories] = useState<NoticeCategory[]>([]);
  const [viewTarget, setViewTarget] = useState<Notice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);

  const filtered =
    selectedCategories.length === 0
      ? notices
      : notices.filter(n => selectedCategories.includes(n.category as NoticeCategory));

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteNotice(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <Flex direction="flex-col" gap="gap-5" className="h-full">
      <Flex align="items-center" justify="justify-between">
        <PageHeader title="공지사항 관리" description="등록된 공지사항을 관리합니다." />
        <Button variant="primary" size="small" onClick={() => navigate('/notices/new')}>
          <PlusSvg className="w-4 h-4 mr-1" />새 공지 작성
        </Button>
      </Flex>

      <Flex as="main" direction="flex-col" gap="gap-4" className="flex-1 min-h-0">
        <Flex align="items-center" gap="gap-2">
          <Filtering label="카테고리" selected={selectedCategories.length > 0}>
            <MultiSelectFilterOption
              labelPrefix="카테고리"
              selectedValues={selectedCategories}
              setFilter={setSelectedCategories}
              options={CATEGORY_OPTIONS}
              ItemComponent={CheckboxAdapter}
            />
          </Filtering>
        </Flex>

        <NoticeTable
          notices={filtered}
          isLoading={isLoading}
          isError={isError}
          onView={setViewTarget}
          onEdit={notice => navigate(`/notices/edit/${notice.id}`)}
          onDelete={setDeleteTarget}
        />
        <div className="pb-6" />
      </Flex>

      {viewTarget && (
        <NoticeViewModal
          notice={viewTarget}
          onClose={() => setViewTarget(null)}
          onEdit={() => {
            setViewTarget(null);
            navigate(`/notices/edit/${viewTarget.id}`);
          }}
        />
      )}

      {deleteTarget && (
        <NoticeDeleteModal
          notice={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
        />
      )}
    </Flex>
  );
}

export default Notices;

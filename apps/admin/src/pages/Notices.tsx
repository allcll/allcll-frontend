import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, AddIcon, Pagination } from '@allcll/allcll-ui';
import {
  Filtering,
  CheckboxAdapter,
  formatMultiSelectedLabel,
  OPERATION_TYPE_LABEL,
  OPERATION_TYPES,
  type OperationType,
} from '@allcll/common';
import MultiSelectFilterOption from '@/components/common/MultiSelectFilterOption';
import PageHeader from '@/components/common/PageHeader';
import NoticeTable from '@/components/notices/NoticeTable';
import NoticeViewModal from '@/components/notices/NoticeViewModal';
import NoticeDeleteModal from '@/components/notices/NoticeDeleteModal';
import { useAdminNotices, useDeleteNotice } from '@/hooks/server/useAdminNotices';
import type { Notice } from '@/hooks/server/useAdminNotices';
import { usePagination } from '@/hooks/usePagination';

const CATEGORY_OPTIONS = OPERATION_TYPES.map(value => ({ label: OPERATION_TYPE_LABEL[value], value }));

function Notices() {
  const navigate = useNavigate();
  const { data: notices = [], isLoading, isError } = useAdminNotices();
  const { mutate: deleteNotice, isPending: isDeleting } = useDeleteNotice();

  const [selectedCategories, setSelectedCategories] = useState<OperationType[]>([]);
  const [viewTarget, setViewTarget] = useState<Notice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);

  const filtered =
    selectedCategories.length === 0 ? notices : notices.filter(n => selectedCategories.includes(n.operationType));
  const { page, totalPages, setPage, pageItems } = usePagination(filtered, selectedCategories.join());

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteNotice(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <Flex direction="column" gap={5} className="h-full">
      <Flex align="center" justify="between">
        <PageHeader title="공지사항 관리" description="등록된 공지사항을 관리합니다." />
        <Button variant="solid" size="small" onClick={() => navigate('/notices/new')}>
          <AddIcon />새 공지 작성
        </Button>
      </Flex>

      <Flex as="main" direction="column" gap={4}>
        <Flex align="center" justify="between" wrap gap={2}>
          <Filtering
            label={formatMultiSelectedLabel('카테고리', selectedCategories, type => OPERATION_TYPE_LABEL[type])}
            selected={selectedCategories.length > 0}
          >
            <MultiSelectFilterOption
              labelPrefix="카테고리"
              selectedValues={selectedCategories}
              setFilter={setSelectedCategories}
              options={CATEGORY_OPTIONS}
              ItemComponent={CheckboxAdapter}
            />
          </Filtering>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </Flex>

        <NoticeTable
          notices={pageItems}
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

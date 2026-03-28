import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowLeftSvg from '@/assets/arrow-left.svg?react';
import SaveSvg from '@/assets/save.svg?react';
import { Card, Button, TextField, Label, Flex } from '@allcll/allcll-ui';
import PageHeader from '@/components/common/PageHeader';
import MarkdownEditor from '@/components/notices/MarkdownEditor';
import UnsavedModal from '@/components/notices/UnsavedModal';
import {
  useAdminNotice,
  useCreateNotice,
  useUpdateNotice,
  CATEGORY_LABELS,
  NOTICE_CATEGORIES,
  type NoticeCategory,
} from '@/hooks/server/useAdminNotices';

const MAX_LENGTH = 10000;

function NoticeEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = id !== undefined;
  const numericId = isEditMode ? Number(id) : undefined;

  const { data: existingNotice, isLoading: isLoadingNotice } = useAdminNotice(numericId);
  const { mutate: createNotice, isPending: isCreating } = useCreateNotice();
  const { mutate: updateNotice, isPending: isUpdating } = useUpdateNotice(numericId ?? 0);

  const isSaving = isCreating || isUpdating;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('GRADUATION');
  const [content, setContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (existingNotice) {
      setTitle(existingNotice.title);
      setCategory(existingNotice.category);
      setContent(existingNotice.content);
      setIsDirty(false);
    }
  }, [existingNotice]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) e.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleBack = () => {
    if (isDirty) {
      setShowUnsavedModal(true);
    } else {
      navigate('/notices');
    }
  };

  const validate = () => {
    const errs: string[] = [];
    if (!title.trim()) errs.push('제목을 입력해주세요.');
    if (!content.trim()) errs.push('내용을 입력해주세요.');
    if (content.length > MAX_LENGTH) errs.push(`내용은 ${MAX_LENGTH.toLocaleString()}자를 초과할 수 없습니다.`);
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSave = useCallback(() => {
    if (!validate()) return;
    const payload = { title: title.trim(), content, category };
    if (isEditMode && numericId !== undefined) {
      updateNotice(payload, {
        onSuccess: () => {
          setIsDirty(false);
          navigate('/notices');
        },
      });
    } else {
      createNotice(payload, {
        onSuccess: () => {
          setIsDirty(false);
          navigate('/notices');
        },
      });
    }
  }, [title, content, category, isEditMode, numericId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;
      if (isMod && e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  const isOverLimit = content.length > MAX_LENGTH;

  if (isEditMode && isLoadingNotice) {
    return (
      <Flex direction="flex-col" gap="gap-5" className="h-full">
        <Flex align="items-center" justify="justify-center" className="flex-1 text-gray-400">
          불러오는 중...
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex direction="flex-col" gap="gap-5" className="h-full">
      <Flex align="items-center" justify="justify-between">
        <Flex align="items-center" gap="gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftSvg className="w-5 h-5" />
          </button>
          <PageHeader title={isEditMode ? '공지사항 수정' : '새 공지 작성'} />
        </Flex>
        <Button variant="primary" size="small" onClick={handleSave} disabled={isSaving || isOverLimit}>
          <SaveSvg className="w-4 h-4 mr-1" />
          {isSaving ? '저장 중...' : '저장하기'}
        </Button>
      </Flex>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {errors.map((e, i) => (
            <p key={i} className="text-sm text-red-700">
              {e}
            </p>
          ))}
        </div>
      )}

      <Card className="flex flex-col gap-5 p-5">
        <TextField
          id="notice-title"
          label="제목"
          size="small"
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            setIsDirty(true);
          }}
          placeholder="공지사항 제목 입력"
          onClear={() => {
            setTitle('');
            setIsDirty(true);
          }}
        />

        <Flex direction="flex-col" gap="gap-1.5">
          <Label id="notice-category">카테고리</Label>
          <select
            id="notice-category"
            value={category}
            onChange={e => {
              setCategory(e.target.value as NoticeCategory);
              setIsDirty(true);
            }}
            className="w-48 p-2 rounded-md bg-white border border-gray-400 text-sm text-gray-900"
          >
            {NOTICE_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </Flex>

        <MarkdownEditor
          content={content}
          onChange={v => {
            setContent(v);
            setIsDirty(true);
          }}
        />
      </Card>
      <div className="pb-6" />

      {showUnsavedModal && (
        <UnsavedModal
          onCancel={() => setShowUnsavedModal(false)}
          onConfirm={() => {
            setIsDirty(false);
            setShowUnsavedModal(false);
            navigate('/notices');
          }}
        />
      )}
    </Flex>
  );
}

export default NoticeEditor;

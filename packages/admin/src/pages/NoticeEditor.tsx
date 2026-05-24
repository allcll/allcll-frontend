import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowLeftSvg from '@/assets/arrow-left.svg?react';
import SaveSvg from '@/assets/save.svg?react';
import { Card, Button, TextField, Label, Flex } from '@allcll/allcll-ui';
import PageHeader from '@/components/common/PageHeader';
import MarkdownEditor from '@/components/notices/MarkdownEditor';
import UnsavedModal from '@/components/notices/UnsavedModal';
import { useAdminNotice, useSaveNotice, CATEGORY_LABELS, NOTICE_CATEGORIES } from '@/hooks/server/useAdminNotices';
import type { OperationType } from '@/hooks/server/useAdminReviews';

const MAX_LENGTH = 1000;
const MAX_TITLE_LENGTH = 250;

function validateNotice(title: string, content: string): string[] {
  const errors: string[] = [];
  if (!title.trim()) errors.push('제목을 입력해주세요.');
  if (title.length > MAX_TITLE_LENGTH) errors.push(`제목은 ${MAX_TITLE_LENGTH}자를 초과할 수 없습니다.`);
  if (!content.trim()) errors.push('내용을 입력해주세요.');
  if (content.length > MAX_LENGTH) errors.push(`내용은 ${MAX_LENGTH.toLocaleString()}자를 초과할 수 없습니다.`);
  return errors;
}

function NoticeEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = id !== undefined;
  const numericId = isEditMode ? Number(id) : undefined;

  const { data: existingNotice, isLoading: isLoadingNotice } = useAdminNotice(numericId);
  const { mutate: saveNotice, isPending: isSaving } = useSaveNotice(numericId);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<OperationType>('GRADUATION');
  const [content, setContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (existingNotice) {
      setTitle(existingNotice.title);
      setCategory(existingNotice.operationType);
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

  const handleSave = () => {
    if (isSaving) return;
    const validationErrors = validateNotice(title, content);
    setErrors(validationErrors);
    if (validationErrors.length > 0) return;
    const payload = { title: title.trim(), content, operationType: category };
    saveNotice(payload, {
      onSuccess: () => {
        setIsDirty(false);
        navigate('/notices');
      },
    });
  };

  const handleSaveRef = useRef(handleSave);
  handleSaveRef.current = handleSave;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;
      if (isMod && (e.key.toLowerCase() === 's' || e.key === 'Enter')) {
        e.preventDefault();
        handleSaveRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isOverLimit = content.length > MAX_LENGTH || title.length > MAX_TITLE_LENGTH;

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
        <Flex direction="flex-col" gap="gap-1">
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
          <Flex justify="justify-end">
            <span
              className={`text-xs ${title.length > MAX_TITLE_LENGTH ? 'text-red-600 font-semibold' : 'text-gray-400'}`}
            >
              {title.length} / {MAX_TITLE_LENGTH}자
            </span>
          </Flex>
        </Flex>

        <Flex direction="flex-col" gap="gap-1.5">
          <Label id="notice-category">카테고리</Label>
          <select
            id="notice-category"
            value={category}
            onChange={e => {
              setCategory(e.target.value as OperationType);
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

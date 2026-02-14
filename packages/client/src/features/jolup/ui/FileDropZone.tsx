import React, { useRef, useState } from 'react';
import XIcon from '@/assets/x.svg?react';
import { IconButton, Flex, Heading, SupportingText } from '@allcll/allcll-ui';
import useToastNotification from '../../notification/model/useToastNotification';

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onDeleteFile: () => void;
  accept?: string;
}

const FileDropZone = ({ onFileSelect, selectedFile, onDeleteFile, accept }: FileDropZoneProps) => {
  const addToast = useToastNotification(state => state.addToast);

  const ref = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

  const onSelectFile = (file?: File) => {
    if (!file) {
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      addToast('파일 크기는 1MB를 초과할 수 없습니다.');
      if (ref.current) {
        ref.current.value = '';
      }
      return;
    }
    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    onSelectFile(e.dataTransfer.files?.[0]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelectFile(event.target.files?.[0]);

    if (ref.current) {
      ref.current.value = '';
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteFile();

    if (ref.current) {
      ref.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      ref.current?.click();
    }
  };

  return (
    <div
      className={`
        relative w-full border-2 border-dashed rounded-lg p-10
        transition-colors duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}
        ${selectedFile ? 'bg-blue-50 border-blue-300' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => ref.current?.click()}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={selectedFile ? '파일 변경' : '파일 업로드'}
    >
      <input type="file" accept={accept} ref={ref} className="hidden" onChange={handleFileChange} />

      {selectedFile ? <SelectedState file={selectedFile} onDelete={handleDeleteClick} /> : <EmptyState />}
    </div>
  );
};

// 파일이 없을 때 (업로드 유도)
const EmptyState = () => {
  return (
    <Flex direction="flex-col" align="items-center" justify="justify-center" gap="gap-4">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 16V4M12 4L7 9M12 4L17 9M20 20H4"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">
          <span className="text-primary-500 font-semibold">클릭하여 업로드</span> 또는 파일을 여기로 드래그하세요
        </p>
        <SupportingText className="mt-1 text-xs">XLSX (최대 1MB)</SupportingText>
      </div>
    </Flex>
  );
};

// 파일이 선택되었을 때
const SelectedState = ({ file, onDelete }: { file: File; onDelete: (e: React.MouseEvent) => void }) => {
  return (
    <>
      <div className="absolute top-2 right-2">
        <IconButton
          variant="plain"
          onClick={onDelete}
          icon={<XIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />}
          label="파일 삭제"
        />
      </div>

      <Flex direction="flex-col" align="items-center" justify="justify-center" gap="gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-primary">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="text-center">
          <Heading level={4} size="md" className="text-gray-900">
            {file.name}
          </Heading>
          <SupportingText className="mt-1 text-xs">
            파일이 선택되었습니다. 변경하려면 클릭하거나 드래그하세요.
          </SupportingText>
        </div>
      </Flex>
    </>
  );
};

export default FileDropZone;

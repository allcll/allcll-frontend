import React, { useRef, useState } from 'react';
import XIcon from '@/assets/x.svg?react';
import UploadIcon from '@/assets/upload.svg?react';
import FileSpreadsheetIcon from '@/assets/file-spreadsheet.svg?react';
import { IconButton, Flex } from '@allcll/allcll-ui';
import useToastNotification from '../../../notification/model/useToastNotification';

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

  return (
    <button
      type="button"
      className={`
        relative w-full border-2 rounded-lg p-10 text-left
        transition-colors duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${selectedFile ? 'border-solid bg-green-50 border-green-400 hover:bg-green-100 hover:border-green-500' : 'border-dashed'}
        ${isDragging ? 'border-primary-500 bg-primary-50' : selectedFile ? '' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => ref.current?.click()}
      aria-label={selectedFile ? '파일 변경' : '파일 업로드'}
    >
      <input type="file" accept={accept} ref={ref} className="hidden" onChange={handleFileChange} />

      {selectedFile ? <SelectedState file={selectedFile} onDelete={handleDeleteClick} /> : <EmptyState />}
    </button>
  );
};

// 파일이 없을 때 (업로드 유도)
const EmptyState = () => {
  return (
    <Flex direction="flex-col" align="items-center" justify="justify-center" gap="gap-3">
      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
        <UploadIcon className="w-7 h-7" />
      </div>

      <div className="text-center">
        <p className="text-base font-medium text-gray-700">
          성적표 파일을 여기에 <span className="text-primary-500 font-semibold">드래그</span>하거나 <span className="text-primary-500 font-semibold">클릭</span>하여 선택하세요
        </p>
        <p className="mt-1 text-sm text-gray-400">XLSX 파일만 가능 (최대 1MB)</p>
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
          icon={<XIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />}
          label="파일 삭제"
        />
      </div>

      <Flex direction="flex-col" align="items-center" justify="justify-center" gap="gap-3">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-500">
          <FileSpreadsheetIcon className="w-7 h-7" />
        </div>

        <div className="text-center">
          <p className="text-base font-semibold text-gray-900">
            {file.name}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            '다음 단계' 버튼을 누르면 분석이 시작됩니다
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            파일을 변경하려면 클릭하거나 드래그하세요
          </p>
        </div>
      </Flex>
    </>
  );
};

export default FileDropZone;

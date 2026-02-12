import { useState } from 'react';
import { Dialog, Flex, Button, Label } from '@allcll/allcll-ui';
import CustomSelect from '@/shared/ui/CustomSelect';
import { useBodyScrollLock } from '@/shared/lib/useBodyScrollLock';
import { useEditProfileForm } from '@/features/joluphaja/lib/useEditProfileForm';
import type { UserResponse } from '@/entities/user/model/types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse;
}

const MAJOR_TYPE_OPTIONS = [
  { value: 'SINGLE', label: '단일전공' },
  { value: 'DOUBLE', label: '복수전공' },
];

function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
  const {
    majorType,
    setMajorType,
    deptNm,
    setDeptNm,
    doubleDeptNm,
    setDoubleDeptNm,
    deptOptions,
    canSave,
    handleSave,
    handleDelete,
    isSaving,
    isDeleting,
  } = useEditProfileForm(user, isOpen, onClose);

  useBodyScrollLock(isOpen);

  const [openDropdown, setOpenDropdown] = useState<'majorType' | 'dept' | 'doubleDept' | null>(null);

  return (
    <Dialog title="회원 정보 수정" onClose={onClose} isOpen={isOpen}>
      <Dialog.Content>
        <Flex direction="flex-col" gap="gap-4" className="min-w-64 md:min-w-80">
          <Flex direction="flex-col" gap="gap-1.5">
            <Label>이수 유형</Label>
            <CustomSelect
              value={majorType}
              options={MAJOR_TYPE_OPTIONS}
              isOpen={openDropdown === 'majorType'}
              onToggle={() => setOpenDropdown(openDropdown === 'majorType' ? null : 'majorType')}
              onSelect={value => {
                setMajorType(value as 'SINGLE' | 'DOUBLE');
                if (value === 'SINGLE') setDoubleDeptNm(null);
                setOpenDropdown(null);
              }}
            />
          </Flex>

          <Flex direction="flex-col" gap="gap-1.5">
            <Label>학과</Label>
            <CustomSelect
              value={deptNm}
              options={deptOptions}
              isOpen={openDropdown === 'dept'}
              onToggle={() => setOpenDropdown(openDropdown === 'dept' ? null : 'dept')}
              onSelect={value => {
                setDeptNm(value);
                setOpenDropdown(null);
              }}
            />
          </Flex>

          {majorType === 'DOUBLE' && (
            <Flex direction="flex-col" gap="gap-1.5">
              <Label>복수전공 학과</Label>
              <CustomSelect
                value={doubleDeptNm}
                placeholder="학과를 선택하세요"
                options={deptOptions}
                isOpen={openDropdown === 'doubleDept'}
                onToggle={() => setOpenDropdown(openDropdown === 'doubleDept' ? null : 'doubleDept')}
                onSelect={value => {
                  setDoubleDeptNm(value);
                  setOpenDropdown(null);
                }}
              />
            </Flex>
          )}
        </Flex>
      </Dialog.Content>

      <Dialog.Footer>
        <Flex justify="justify-between" className="w-full">
          <Button variant="secondary" size="small" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? '처리 중...' : '회원 탈퇴'}
          </Button>
          <Button variant="primary" size="small" onClick={handleSave} disabled={!canSave || isSaving}>
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </Flex>
      </Dialog.Footer>
    </Dialog>
  );
}

export default EditProfileModal;

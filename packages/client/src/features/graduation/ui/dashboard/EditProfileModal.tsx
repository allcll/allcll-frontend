import { Dialog, Flex, Button, Label, Select, SearchableSelect } from '@allcll/allcll-ui';
import { matchOptionKeyword } from '@/shared/lib/search.ts';
import { useEditProfileForm } from '@/features/graduation/lib/useEditProfileForm';
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

  return (
    <Dialog title="회원 정보 수정" onClose={onClose} isOpen={isOpen}>
      <Dialog.Content>
        <Flex direction="flex-col" gap="gap-4" className="min-w-64 md:min-w-80">
          <Flex direction="flex-col" gap="gap-1.5">
            <Label id="edit-profile-major-type">이수 유형</Label>
            <Select
              id="edit-profile-major-type"
              className="w-full"
              value={majorType}
              onChange={e => {
                const value = e.target.value as 'SINGLE' | 'DOUBLE';
                setMajorType(value);
                if (value === 'SINGLE') setDoubleDeptNm(null);
              }}
            >
              {MAJOR_TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Flex>

          <Flex direction="flex-col" gap="gap-1.5">
            <Label>학과</Label>
            <SearchableSelect
              className="w-full"
              value={deptNm}
              options={deptOptions}
              onChange={setDeptNm}
              searchPlaceholder="학과 검색"
              emptyDescription="다른 학과 이름으로 검색해주세요."
              filterOption={matchOptionKeyword}
            />
          </Flex>

          {majorType === 'DOUBLE' && (
            <Flex direction="flex-col" gap="gap-1.5">
              <Label>복수전공 학과</Label>
              <SearchableSelect
                className="w-full"
                value={doubleDeptNm}
                placeholder="학과를 선택하세요"
                options={deptOptions}
                onChange={setDoubleDeptNm}
                searchPlaceholder="학과 검색"
                emptyDescription="다른 학과 이름으로 검색해주세요."
                filterOption={matchOptionKeyword}
              />
            </Flex>
          )}
        </Flex>
      </Dialog.Content>

      <Dialog.Footer>
        <Flex justify="justify-between" className="w-full">
          <Button variant="solid" color="gray" size="small" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? '처리 중...' : '회원 탈퇴'}
          </Button>
          <Button variant="solid" size="small" onClick={handleSave} disabled={!canSave || isSaving}>
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </Flex>
      </Dialog.Footer>
    </Dialog>
  );
}

export default EditProfileModal;

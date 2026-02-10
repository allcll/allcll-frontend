import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, Flex, Button, Label } from '@allcll/allcll-ui';
import CustomSelect from '@/shared/ui/CustomSelect';
import { useBodyScrollLock } from '@/shared/lib/useBodyScrollLock';
import useDepartments from '@/entities/departments/api/useDepartments';
import { useUpdateMe, useDeleteMe } from '@/entities/user/model/useAuth';
import { graduationQueryKeys } from '@/entities/joluphaja/model/useGraduation';
import type { UserInfo } from '@/entities/joluphaja/api/graduation';
import type { UpdateMeRequest } from '@/entities/user/model/types';

type MajorType = 'SINGLE' | 'DOUBLE';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: UserInfo;
}

const MAJOR_TYPE_OPTIONS = [
  { value: 'SINGLE', label: '단일전공' },
  { value: 'DOUBLE', label: '복수전공' },
];

function EditProfileModal({ isOpen, onClose, userInfo }: EditProfileModalProps) {
  const queryClient = useQueryClient();
  const updateMeMutation = useUpdateMe();
  const deleteMeMutation = useDeleteMe();
  const navigate = useNavigate();
  const { data: departments } = useDepartments();
  useBodyScrollLock(isOpen);

  const currentMajorType: MajorType = userInfo.majorType === 'MINOR' ? 'SINGLE' : userInfo.majorType;
  const deptNames =
    departments
      ?.filter(d => d.departmentCode !== '9005')
      .map(d => (d.departmentName ? d.departmentName.split(' ').slice(-1)[0] : '학과 정보 없음')) ?? [];
  const deptOptions = deptNames.map(name => ({ value: name, label: name }));

  const [majorType, setMajorType] = useState<MajorType>(currentMajorType);
  const [deptNm, setDeptNm] = useState(userInfo.deptName);
  const [doubleDeptNm, setDoubleDeptNm] = useState(deptNames[0] ?? '');
  const [openDropdown, setOpenDropdown] = useState<'majorType' | 'dept' | 'doubleDept' | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMajorType(currentMajorType);
      setDeptNm(userInfo.deptName);
      setDoubleDeptNm(deptNames[0] ?? '');
      setOpenDropdown(null);
    }
  }, [isOpen]);

  const handleSave = () => {
    const changedDept = deptNm !== userInfo.deptName ? deptNm : null;

    const request: UpdateMeRequest = {
      deptNm: changedDept,
      majorType,
      doubleDeptNm: majorType === 'DOUBLE' ? doubleDeptNm : null,
    };

    updateMeMutation.mutate(request, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: graduationQueryKeys.all });
        onClose();
      },
    });
  };

  const handleDelete = () => {
    if (!window.confirm('정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

    deleteMeMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: graduationQueryKeys.all });
        onClose();
        navigate('/');
      },
    });
  };

  const isSaving = updateMeMutation.isPending;
  const isDeleting = deleteMeMutation.isPending;

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
                setMajorType(value as MajorType);
                if (value === 'SINGLE') setDoubleDeptNm('');
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
          <Button variant="primary" size="small" onClick={handleSave} disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </Flex>
      </Dialog.Footer>
    </Dialog>
  );
}

export default EditProfileModal;

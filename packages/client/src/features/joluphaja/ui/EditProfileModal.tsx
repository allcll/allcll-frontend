import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, Flex, Button, ListboxOption } from '@allcll/allcll-ui';
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

const selectClassName =
  'w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary-500';

// 커스텀 드롭다운

function CustomSelect({
  value,
  displayValue,
  options,
  isOpen,
  onToggle,
  onSelect,
}: {
  value: string;
  displayValue?: string;
  options: { value: string; label: string }[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}) {
  const label = displayValue ?? options.find(o => o.value === value)?.label ?? value;

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={`${selectClassName} text-left flex justify-between items-center`}
      >
        <span>{label}</span>
        <span className="text-gray-400 text-xs">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="mt-1 max-h-48 overflow-auto border border-gray-200 rounded-md">
          {options.map(option => (
            <ListboxOption
              key={option.value}
              selected={option.value === value}
              left={<span>{option.label}</span>}
              onSelect={() => onSelect(option.value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// 메인 모달

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
          {/* 이수 유형 */}
          <Flex direction="flex-col" gap="gap-1.5">
            <label className="text-sm text-gray-500">이수 유형</label>
            <CustomSelect
              value={majorType}
              options={MAJOR_TYPE_OPTIONS}
              isOpen={openDropdown === 'majorType'}
              onToggle={() => setOpenDropdown(openDropdown === 'majorType' ? null : 'majorType')}
              onSelect={val => {
                setMajorType(val as MajorType);
                if (val === 'SINGLE') setDoubleDeptNm('');
                setOpenDropdown(null);
              }}
            />
          </Flex>

          {/* 학과 */}
          <Flex direction="flex-col" gap="gap-1.5">
            <label className="text-sm text-gray-500">학과</label>
            <CustomSelect
              value={deptNm}
              options={deptOptions}
              isOpen={openDropdown === 'dept'}
              onToggle={() => setOpenDropdown(openDropdown === 'dept' ? null : 'dept')}
              onSelect={val => {
                setDeptNm(val);
                setOpenDropdown(null);
              }}
            />
          </Flex>

          {/* 복수전공 학과 */}
          {majorType === 'DOUBLE' && (
            <Flex direction="flex-col" gap="gap-1.5">
              <label className="text-sm text-gray-500">복수전공 학과</label>
              <CustomSelect
                value={doubleDeptNm}
                displayValue={doubleDeptNm || '학과를 선택하세요'}
                options={deptOptions}
                isOpen={openDropdown === 'doubleDept'}
                onToggle={() => setOpenDropdown(openDropdown === 'doubleDept' ? null : 'doubleDept')}
                onSelect={val => {
                  setDoubleDeptNm(val);
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

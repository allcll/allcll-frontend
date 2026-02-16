import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAdmissionYearDepartments, graduationQueryKeys } from '@/entities/graduation/model/useGraduation';
import { useUpdateMe, useDeleteMe } from '@/entities/user/model/useAuth';
import type { MajorType, UpdateMeRequest, UserResponse } from '@/entities/user/model/types';

export function useEditProfileForm(user: UserResponse, isOpen: boolean, onClose: () => void) {
  const queryClient = useQueryClient();
  const updateMeMutation = useUpdateMe();
  const deleteMeMutation = useDeleteMe();
  const navigate = useNavigate();
  const { data: departments } = useAdmissionYearDepartments();

  const deptNames =
    departments
      ?.filter(dept => dept.departmentCode !== '9005')
      .map(dept => dept.departmentName || '학과 정보 없음') ?? [];
  const deptOptions = deptNames.map(name => ({ value: name, label: name }));

  const [majorType, setMajorType] = useState<MajorType>(user.majorType);
  const [deptNm, setDeptNm] = useState(user.deptName);
  const [doubleDeptNm, setDoubleDeptNm] = useState<string | null>(user.doubleDeptName);

  useEffect(() => {
    if (isOpen) {
      setMajorType(user.majorType);
      setDeptNm(user.deptName);
      setDoubleDeptNm(user.doubleDeptName);
    }
  }, [isOpen]);

  const canSave = majorType === 'SINGLE' || doubleDeptNm !== null;

  const isDeptChanged = deptNm !== user.deptName;
  const isMajorTypeChanged = majorType !== user.majorType;
  const isDoubleDeptChanged = doubleDeptNm !== user.doubleDeptName;
  const hasChanges = isDeptChanged || isMajorTypeChanged || isDoubleDeptChanged;

  const handleSave = () => {
    if (!canSave || !hasChanges) return;

    const isChangingToSingle = majorType === 'SINGLE' && user.majorType !== 'SINGLE';

    const request: UpdateMeRequest = {
      deptNm: isDeptChanged || isChangingToSingle ? deptNm : null,
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

  return {
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
    isSaving: updateMeMutation.isPending,
    isDeleting: deleteMeMutation.isPending,
  };
}

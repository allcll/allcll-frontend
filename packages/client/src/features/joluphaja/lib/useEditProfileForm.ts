import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import useDepartments from '@/entities/departments/api/useDepartments';
import { useUpdateMe, useDeleteMe } from '@/entities/user/model/useAuth';
import { graduationQueryKeys } from '@/entities/joluphaja/model/useGraduation';
import type { UserInfo } from '@/entities/joluphaja/api/graduation';
import type { UpdateMeRequest } from '@/entities/user/model/types';

type MajorType = 'SINGLE' | 'DOUBLE';

export function useEditProfileForm(userInfo: UserInfo, isOpen: boolean, onClose: () => void) {
  const queryClient = useQueryClient();
  const updateMeMutation = useUpdateMe();
  const deleteMeMutation = useDeleteMe();
  const navigate = useNavigate();
  const { data: departments } = useDepartments();

  const currentMajorType: MajorType = userInfo.majorType === 'MINOR' ? 'SINGLE' : userInfo.majorType;
  const deptNames =
    departments
      ?.filter(d => d.departmentCode !== '9005')
      .map(d => (d.departmentName ? d.departmentName.split(' ').slice(-1)[0] : '학과 정보 없음')) ?? [];
  const deptOptions = deptNames.map(name => ({ value: name, label: name }));

  const [majorType, setMajorType] = useState<MajorType>(currentMajorType);
  const [deptNm, setDeptNm] = useState(userInfo.deptName);
  const [doubleDeptNm, setDoubleDeptNm] = useState(deptNames[0] ?? '');

  useEffect(() => {
    if (isOpen) {
      setMajorType(currentMajorType);
      setDeptNm(userInfo.deptName);
      setDoubleDeptNm(deptNames[0] ?? '');
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

  return {
    majorType,
    setMajorType,
    deptNm,
    setDeptNm,
    doubleDeptNm,
    setDoubleDeptNm,
    deptOptions,
    handleSave,
    handleDelete,
    isSaving: updateMeMutation.isPending,
    isDeleting: deleteMeMutation.isPending,
  };
}

import { useEffect, useState } from 'react';
import Modal from '@/components/simulation/modal/Modal.tsx';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';
import MultiSelect from '@/components/contentPanel/filter/MultiSelect.tsx';
import { FilterDomains, getCategories } from '@/utils/filtering/filterDomains.ts';
import useSubject from '@/hooks/server/useSubject.ts';
import DayTimeFilter, { IDayTimeItem } from '@/components/contentPanel/filter/DayTimeFilter.tsx';

interface IModalProps {
  onClose: () => void;
}

const ClassroomOptions = FilterDomains.classRoom
  .sort((a, b) => a.localeCompare(b))
  .map(cr => ({ label: cr, value: cr }));

const RemarkOptions = FilterDomains.remark.map(rm => ({ label: rm, value: rm }));

function FilteringModal({ onClose }: Readonly<IModalProps>) {
  const [classroom, setClassroom] = useState<string[]>([...FilterDomains.classRoom]);
  const [remark, setRemark] = useState<string[]>([...FilterDomains.remark]);
  const [category, setCategory] = useState<string[]>([]);
  const [time, setTime] = useState<IDayTimeItem[]>([]);

  const { data: subjects } = useSubject();
  const categories = getCategories(subjects ?? []);
  const categoryOptions = categories.sort((a, b) => a.localeCompare(b)).map(cat => ({ label: cat, value: cat }));

  useEffect(() => {
    setCategory([...categories]);
  }, [subjects]);

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="과목 필터링" onClose={onClose} />

      <h3 className="font-bold text-lg">강의실 필터</h3>
      <MultiSelect items={ClassroomOptions} selectedItems={classroom} setSelectedItems={setClassroom} />

      <h3 className="font-bold text-lg">비고 필터</h3>
      <MultiSelect items={RemarkOptions} selectedItems={remark} setSelectedItems={setRemark} />

      <h3 className="font-bold text-lg">카테고리 필터</h3>
      <MultiSelect items={categoryOptions} selectedItems={category} setSelectedItems={setCategory} />

      <h3 className="font-bold text-lg">시간 필터</h3>
      <DayTimeFilter items={time} onChange={i => setTime(i)} />
    </Modal>
  );
}

export default FilteringModal;

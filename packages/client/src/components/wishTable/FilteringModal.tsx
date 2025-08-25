import Modal from '@/components/simulation/modal/Modal.tsx';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';
import MultiSelect from '@/components/contentPanel/filter/MultiSelect.tsx';
import DayTimeFilter from '@/components/contentPanel/filter/DayTimeFilter.tsx';
import { FilterDomains, FilterOptions, getCategories } from '@/utils/filtering/filterDomains.ts';
import { FilterStore } from '@/store/useFilterStore.ts';
import useSubject from '@/hooks/server/useSubject.ts';
import { Curitype, RemarkType } from '@/utils/types.ts';

interface IModalProps {
  filterStore: FilterStore;
  onClose: () => void;
}

const ClassroomOptions = FilterOptions.classRoom.sort((a, b) => a.label.localeCompare(b.label));

const RemarkOptions = FilterDomains.remark.map(rm => ({ label: rm, value: rm }));

function FilteringModal({ filterStore, onClose }: Readonly<IModalProps>) {
  const { classroom, note, categories, time } = filterStore(state => state.filters);
  const setFilter = filterStore(state => state.setFilter);

  const { data: subjects } = useSubject();
  const categoryOptions = getCategories(subjects ?? [])
    .sort((a, b) => a.localeCompare(b))
    .map(cat => ({ label: cat, value: cat }));

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="과목 필터링" onClose={onClose} />

      <h3 className="font-bold text-lg">강의실 필터</h3>
      <MultiSelect
        items={ClassroomOptions}
        selectedItems={classroom}
        setSelectedItems={v => setFilter('classroom', v)}
      />

      <h3 className="font-bold text-lg">비고 필터</h3>
      <MultiSelect
        items={RemarkOptions}
        selectedItems={note}
        setSelectedItems={v => setFilter('note', v as RemarkType[])}
      />

      <h3 className="font-bold text-lg">카테고리 필터</h3>
      <MultiSelect
        items={categoryOptions}
        selectedItems={categories}
        setSelectedItems={v => setFilter('categories', v as Curitype[])}
      />

      <h3 className="font-bold text-lg">시간 필터</h3>
      <DayTimeFilter items={time} onChange={v => setFilter('time', v)} />
    </Modal>
  );
}

export default FilteringModal;

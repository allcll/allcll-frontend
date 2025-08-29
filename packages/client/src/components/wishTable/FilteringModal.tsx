import Modal from '@common/components/modal/Modal';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';
import DayTimeFilter, { IDayTimeItem } from '@/components/contentPanel/filter/DayTimeFilter.tsx';
import { FilterDomains, FilterOptions, getCategories } from '@/utils/filtering/filterDomains.ts';
import { FilterStore } from '@/store/useFilterStore.ts';
import useSubject from '@/hooks/server/useSubject.ts';
import { Curitype, RemarkType } from '@/utils/types.ts';
import MultiSelectFilterOption from '@common/components/filtering/MultiSelectFilterOption';
import CheckboxAdapter from '@common/components/checkbox/CheckboxAdapter';
import Chip from '@common/components/chip/Chip';
import CustomButton from '@common/components/Button';

interface IModalProps {
  filterStore: FilterStore;
  onClose: () => void;
}

const ClassroomOptions = FilterOptions.classRoom.sort((a, b) => a.label.localeCompare(b.label));

const RemarkOptions = FilterDomains.remark.map(rm => ({ label: rm, value: rm }));

function FilteringModal({ filterStore, onClose }: Readonly<IModalProps>) {
  const { classroom, note, categories, time } = filterStore(state => state.filters);
  const setFilter = filterStore(state => state.setFilter);
  const resetFilters = filterStore(state => state.resetFilters);

  const { data: subjects } = useSubject();
  const categoryOptions = getCategories(subjects ?? [])
    .sort((a, b) => a.localeCompare(b))
    .map(cat => ({ label: cat, value: cat }));

  /**TODO: 로직 통합 및 개선 */
  const setRemarkFilterWrapper = (field: string, value: string[]) => {
    if (field === 'selectedRemarks') {
      setFilter('note', value as RemarkType[]);
    }
  };

  const setClassroomFilterWrapper = (field: string, value: string[]) => {
    if (field === 'selectedClassrooms') {
      setFilter('classroom', value);
    }
  };

  const setCategoryFilterWrapper = (field: string, value: string[]) => {
    if (field === 'selectedCategories') {
      setFilter('categories', value as Curitype[]);
    }
  };

  const setTimeFilterWrapper = (field: string, value: IDayTimeItem[]) => {
    if (field === 'time') {
      setFilter('time', value as IDayTimeItem[]);
    }
  };

  const handleChipClick = (field: string, value: string) => {
    if (field === 'selectedCategories') {
      setFilter(
        'categories',
        categories.filter(cat => cat !== value),
      );
    }
    if (field === 'selectedRemarks') {
      setFilter(
        'note',
        note.filter(n => n !== value),
      );
    }
    if (field === 'selectedClassrooms') {
      setFilter(
        'classroom',
        classroom.filter(c => c !== value),
      );
    }
  };

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="상세 필터링" onClose={onClose} />

      <div className="flex flex-col gap-2 p-4 w-130 max-h-[500px] overflow-y-auto">
        <div className="flex flex-wrap gap-2 w-fit">
          {categories.map(category => (
            <Chip
              key={String(category)}
              onClick={() => handleChipClick('selectedCategories', category)}
              chipType="cancel"
              selected={true}
              label={category}
            />
          ))}
          {note.map(note => (
            <Chip
              key={String(note)}
              onClick={() => handleChipClick('selectedRemarks', note)}
              chipType="cancel"
              selected={true}
              label={note}
            />
          ))}
          {classroom.map(classroom => (
            <Chip
              key={String(classroom)}
              onClick={() => handleChipClick('selectedClassrooms', classroom)}
              chipType="cancel"
              selected={true}
              label={ClassroomOptions.find(cr => cr.value === classroom)?.label}
            />
          ))}
        </div>

        <h3 className="text-xs mb-1 sm:text-lg text-gray-500 font-medium sm:text-gray-600">수업유형</h3>
        <MultiSelectFilterOption
          selectedValues={categories}
          options={categoryOptions}
          field="selectedCategories"
          setFilter={setCategoryFilterWrapper}
          ItemComponent={CheckboxAdapter}
        />

        <h3 className="text-xs mb-1 sm:text-lg text-gray-500 font-medium sm:text-gray-600">시간</h3>
        <DayTimeFilter items={time} onChange={items => setTimeFilterWrapper('time', items)} />

        <h3 className="text-xs mb-1 sm:text-lg text-gray-500 font-medium sm:text-gray-600">비고</h3>
        <MultiSelectFilterOption
          selectedValues={note}
          options={RemarkOptions}
          field="selectedRemarks"
          setFilter={setRemarkFilterWrapper}
          ItemComponent={CheckboxAdapter}
        />

        <h3 className="text-xs mb-1 sm:text-lg text-gray-500 font-medium sm:text-gray-600">강의실</h3>
        <MultiSelectFilterOption
          selectedValues={classroom}
          options={ClassroomOptions}
          field="selectedClassrooms"
          setFilter={setClassroomFilterWrapper}
          ItemComponent={CheckboxAdapter}
        />
      </div>

      <div className="flex justify-end bg-white p-2 border-t border-gray-200">
        <CustomButton variants="primary" onClick={resetFilters}>
          상세필터 초기화
        </CustomButton>
      </div>
    </Modal>
  );
}

export default FilteringModal;

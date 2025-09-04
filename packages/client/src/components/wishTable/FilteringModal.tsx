import Modal from '@common/components/modal/Modal';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';
import { FilterDomains, getCategories } from '@/utils/filtering/filterDomains.ts';
import { FilterStore } from '@/store/useFilterStore.ts';
import useSubject from '@/hooks/server/useSubject.ts';
import CheckboxAdapter from '@common/components/checkbox/CheckboxAdapter';
import Chip from '@common/components/chip/Chip';
import CustomButton from '@common/components/Button';
import MultiSelectFilter from '../filtering/MultiSelectFilter';
import DayTimeFilter from '../filtering/DayTimeFilter';

interface IModalProps {
  filterStore: FilterStore;
  onClose: () => void;
}

function FilteringModal({ filterStore, onClose }: Readonly<IModalProps>) {
  const { classroom, note, categories, time } = filterStore(state => state.filters);
  const setFilter = filterStore(state => state.setFilter);
  const resetFilters = filterStore(state => state.resetFilters);

  const { data: subjects } = useSubject();
  const categoryOptions = getCategories(subjects ?? [])
    .sort((a, b) => a.localeCompare(b))
    .map(cat => cat);

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="상세 필터링" onClose={onClose} />

      <div className="flex flex-col gap-2 p-4 w-130 max-h-[500px] overflow-y-auto">
        <div className="flex flex-wrap gap-2 w-fit">
          {categories.map(category => (
            <Chip
              key={String(category)}
              onClick={() =>
                setFilter(
                  'categories',
                  categories.filter(cat => cat !== category),
                )
              }
              chipType="cancel"
              selected={true}
              label={category}
            />
          ))}
          {note.map(remark => (
            <Chip
              key={String(remark)}
              onClick={() =>
                setFilter(
                  'note',
                  note.filter(n => n !== remark),
                )
              }
              chipType="cancel"
              selected={true}
              label={note}
            />
          ))}
          {classroom.map(classRoom => (
            <Chip
              key={String(classRoom)}
              onClick={() =>
                setFilter(
                  'classroom',
                  classroom.filter(c => c !== classRoom),
                )
              }
              chipType="cancel"
              selected={true}
              label={classRoom}
            />
          ))}
        </div>

        <h3 className="text-xs mb-1 sm:text-lg text-gray-500 font-medium sm:text-gray-600">수업유형</h3>
        <MultiSelectFilter
          selectedValues={categories}
          options={categoryOptions}
          filterKey="categories"
          setFilter={setFilter}
          ItemComponent={CheckboxAdapter}
          className="md:overflow-y-visible"
        />

        <h3 className="text-xs mb-1 sm:text-lg text-gray-500 font-medium sm:text-gray-600">시간</h3>
        <DayTimeFilter items={time} onChange={items => setFilter('time', items)} />

        <MultiSelectFilter
          selectedValues={note}
          options={FilterDomains.remark}
          filterKey="note"
          setFilter={setFilter}
          ItemComponent={CheckboxAdapter}
          className="md:overflow-y-visible"
        />

        <MultiSelectFilter
          selectedValues={classroom}
          options={FilterDomains.classRoom}
          filterKey="classroom"
          setFilter={setFilter}
          ItemComponent={CheckboxAdapter}
          className="md:overflow-y-visible"
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

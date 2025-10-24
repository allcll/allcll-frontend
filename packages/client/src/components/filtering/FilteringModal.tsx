import Modal from '@common/components/modal/Modal';
import ModalHeader from '@/components/sejongUI/modal/ModalHeader.tsx';
import { FilterDomains, getCategories } from '@/utils/filtering/filterDomains.ts';
import { Filters, FilterStore, getAllSelectedLabels, initialFilters } from '@/store/useFilterStore.ts';
import useSubject from '@/hooks/server/useSubject.ts';
import CheckboxAdapter from '@common/components/checkbox/CheckboxAdapter';
import Chip from '@common/components/chip/Chip';
import CustomButton from '@common/components/Button';
import MultiSelectFilter from '../filtering/MultiSelectFilter';
import DayTimeFilter from '../filtering/DayTimeFilter';
import useDepartments from '@/hooks/server/useDepartments';

interface IModalProps {
  filterStore: FilterStore;
  onClose: () => void;
}

type FilterValueType<K extends keyof Filters> = Filters[K] extends (infer U)[] ? U : Filters[K];

function FilteringModal({ filterStore, onClose }: Readonly<IModalProps>) {
  const { classroom, note, categories, time } = filterStore(state => state.filters);
  const departments = useDepartments();
  const filters = filterStore(state => state.filters);
  const setFilter = filterStore(state => state.setFilter);
  const resetFilters = filterStore(state => state.resetFilters);
  const allSelectedFilters = getAllSelectedLabels(filters, departments.data);

  const { data: subjects } = useSubject();
  const categoryOptions = getCategories(subjects ?? [])
    .sort((a, b) => a.localeCompare(b))
    .map(cat => cat);

  const handleDeleteFilter = (filterKey: keyof Filters, value: FilterValueType<keyof Filters>) => {
    const currentValue = filters[filterKey];

    if (Array.isArray(currentValue)) {
      setFilter(
        filterKey,
        (currentValue as (typeof value)[]).filter(item => item !== value),
      );
    } else {
      setFilter(filterKey, initialFilters[filterKey]);
    }
  };
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="상세 필터링" onClose={onClose} />

      <div className="flex flex-col gap-2 p-4 w-130 max-h-[500px] overflow-y-auto">
        <div className="flex flex-wrap gap-2 w-fit">
          {allSelectedFilters.map(filter => {
            return (
              <Chip
                key={`${filter.filterKey}-${filter.values}`}
                chipType="cancel"
                label={filter.label}
                selected={true}
                onClick={() => handleDeleteFilter(filter.filterKey, filter.values)}
              />
            );
          })}
        </div>

        <MultiSelectFilter
          selectedValues={categories}
          options={categoryOptions}
          filterKey="categories"
          setFilter={setFilter}
          ItemComponent={CheckboxAdapter}
          className="md:overflow-y-visible"
        />

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
          필터 초기화
        </CustomButton>
      </div>
    </Modal>
  );
}

export default FilteringModal;

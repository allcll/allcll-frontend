import { FilterDomains, getCategories } from '@/utils/filtering/filterDomains.ts';
import { Filters, FilterStore, getAllSelectedLabels, initialFilters } from '@/shared/model/useFilterStore.ts';
import useSubject from '@/entities/subjects/api/useSubject.ts';
import Chip from '@common/components/chip/Chip.tsx';
import MultiSelectFilter from '../../../features/filtering/ui/MultiSelectFilter.tsx';
import DayTimeFilter from '../../../features/filtering/ui/DayTimeFilter.tsx';
import useDepartments from '@/entities/departments/api/useDepartments.ts';
import { Button, Card, Dialog, Flex } from '@allcll/allcll-ui';

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
    <Dialog title="상세 필터링" onClose={onClose} isOpen={true}>
      <Flex direction="flex-row">
        <Dialog.Content>
          <Flex direction="flex-col" gap="gap-4" className="w-130">
            <Card variant="outlined">
              <MultiSelectFilter
                selectedValues={categories}
                options={categoryOptions}
                filterKey="categories"
                setFilter={setFilter}
                ItemComponent={Chip}
                className="md:overflow-y-visible"
              />
            </Card>

            <Card variant="outlined">
              <DayTimeFilter items={time} onChange={items => setFilter('time', items)} />
            </Card>

            <Card variant="outlined">
              <MultiSelectFilter
                selectedValues={note}
                options={FilterDomains.remark}
                filterKey="note"
                setFilter={setFilter}
                ItemComponent={Chip}
                className="md:overflow-y-visible"
              />
            </Card>

            <Card variant="outlined">
              <MultiSelectFilter
                selectedValues={classroom}
                options={FilterDomains.classRoom}
                filterKey="classroom"
                setFilter={setFilter}
                ItemComponent={Chip}
                className="md:overflow-y-visible"
              />
            </Card>
          </Flex>
        </Dialog.Content>
      </Flex>

      <Dialog.Footer>
        <Flex direction="flex-col" gap="gap-2">
          <Flex gap="gap-2" direction="flex-wrap" justify="justify-end" className="w-120">
            {allSelectedFilters.map(filter => (
              <Chip
                key={`${filter.filterKey}-${filter.values}`}
                chipType="cancel"
                label={filter.label}
                selected
                onClick={() => handleDeleteFilter(filter.filterKey, filter.values)}
              />
            ))}
          </Flex>

          <Flex justify="justify-end">
            <Button variant="primary" size="medium" onClick={resetFilters}>
              필터 초기화
            </Button>
          </Flex>
        </Flex>
      </Dialog.Footer>
    </Dialog>
  );
}

export default FilteringModal;

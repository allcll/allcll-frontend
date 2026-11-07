import { FilterDomains, getCategories } from '@/features/filtering/lib/filterDomains.ts';
import { Filters, FilterStore, initialFilters } from '@/features/filtering/model/useFilterStore.ts';
import useSubject from '@/entities/subjects/model/useSubject.ts';
import MultiSelectFilter from '../../../features/filtering/ui/MultiSelectFilter.tsx';
import useDepartments from '@/entities/departments/api/useDepartments.ts';
import { Button, Card, Chip, Dialog, Flex } from '@allcll/allcll-ui';
import SelectedFilterChips from '@/features/filtering/ui/SelectedFilterChips.tsx';
import { getAllSelectedLabels } from '@/features/filtering/lib/filterUtils.ts';
import { useSemesterParam } from '@/entities/semester/model/useSemesterParam.ts';

interface IModalProps {
  filterStore: FilterStore;
  onClose: () => void;
}

type FilterValueType<K extends keyof Filters> = Filters[K] extends (infer U)[] ? U : Filters[K];

function DetailFilterModal({ filterStore, onClose }: Readonly<IModalProps>) {
  const semester = useSemesterParam();

  const { classroom, note, categories } = filterStore(state => state.filters);
  const departments = useDepartments();
  const filters = filterStore(state => state.filters);
  const setFilter = filterStore(state => state.setFilter);
  const resetFilters = filterStore(state => state.resetFilters);
  const allSelectedFilters = getAllSelectedLabels(filters, departments.data);

  const { data: subjects } = useSubject(semester);
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
    <Dialog title="필터" onClose={onClose} isOpen={true}>
      <Dialog.Content>
        <Flex direction="flex-col" gap="gap-4" className="w-130">
          <Card variant="outlined">
            <MultiSelectFilter
              selectedValues={categories}
              options={categoryOptions}
              filterKey="categories"
              setFilter={setFilter}
              ItemComponent={Chip}
            />
          </Card>

          <Card variant="outlined">
            <MultiSelectFilter
              selectedValues={classroom}
              options={FilterDomains.classRoom}
              filterKey="classroom"
              setFilter={setFilter}
              ItemComponent={Chip}
            />
          </Card>

          <Card variant="outlined">
            <MultiSelectFilter
              selectedValues={note}
              options={FilterDomains.remark}
              filterKey="note"
              setFilter={setFilter}
              ItemComponent={Chip}
            />
          </Card>
        </Flex>
      </Dialog.Content>

      <Dialog.Footer>
        <Flex direction="flex-col" gap="gap-3" className="w-full">
          {/* 칩이 한 줄로 늘어나 모달 폭을 넓히지 않도록 폭 계산에서 빼고 내용 폭에 맞춰 줄바꿈 */}
          <div className="[contain:inline-size]">
            <SelectedFilterChips items={allSelectedFilters} onDelete={handleDeleteFilter} />
          </div>

          <Flex justify="justify-end" align="items-center" gap="gap-2">
            <Button
              variant="solid"
              color="gray"
              size="medium"
              onClick={resetFilters}
              disabled={allSelectedFilters.length === 0}
            >
              필터 초기화
            </Button>
            <Button variant="solid" size="medium" onClick={onClose}>
              완료
            </Button>
          </Flex>
        </Flex>
      </Dialog.Footer>
    </Dialog>
  );
}

export default DetailFilterModal;

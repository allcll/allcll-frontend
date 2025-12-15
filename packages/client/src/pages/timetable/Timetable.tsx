import { useState } from 'react';
import { Helmet } from 'react-helmet';
import TimetableComponent from '@/components/timetable/TimetableComponent.tsx';
import SearchBottomSheet from '@/components/contentPanel/bottomSheet/SearchBottomSheet';
import FilteringBottomSheet from '@/components/contentPanel/bottomSheet/FilteringBottomSheet';
import FormBottomSheet from '@/components/contentPanel/bottomSheet/FormBottomSheet';
import ScheduleFormModal from '@/components/contentPanel/ScheduleFormModal';
import ContentPanel from '@/components/contentPanel/ScheduleContentPanel';
import EditTimetable from '@/components/contentPanel/EditTimetable';
import TimetableHeader from '@/components/timetable/TimetableHeader';
import ScheduleInfoModal from '@/components/contentPanel/ScheduleInfoModal';
import ScheduleInfoBottomSheet from '@/components/contentPanel/bottomSheet/ScheduleDetailBottomSheet';
import { BottomSheetType, useBottomSheetStore } from '@/store/useBottomSheetStore';
import AddWhiteSvg from '@/assets/add-white.svg?react';
import Card from '@common/components/Card';
import { Button, Flex, Heading, SupportingText } from '@allcll/allcll-ui';
import { useScheduleSearchStore } from '@/store/useFilterStore';
import useMobile from '@/hooks/useMobile';
import TimetableTabs from '@/components/timetable/TimetableTabs';

type modalType = 'edit' | 'create' | null;

function Timetable() {
  const [isOpenModal, setIsOpenModal] = useState<modalType>(null);
  const isMobile = useMobile();

  const bottomSheetType = useBottomSheetStore(state => state.type);
  const closeBottomSheet = useBottomSheetStore(state => state.closeBottomSheet);
  const openBottomSheet = useBottomSheetStore(state => state.openBottomSheet);

  const filters = useScheduleSearchStore(state => state.filters);
  const setFilter = useScheduleSearchStore(state => state.setFilter);
  const resetFilter = useScheduleSearchStore(state => state.resetFilters);

  const handleClickFiltering = (bottomSheetType: BottomSheetType) => {
    closeBottomSheet('search');
    openBottomSheet(bottomSheetType);
  };

  const handleCloseFiltering = () => {
    closeBottomSheet('filter');
    openBottomSheet('search');
  };

  return (
    <div className="w-full p-4">
      <Helmet>
        <title>ALLCLL | 시간표</title>
      </Helmet>

      <div className="grid md:grid-cols-5 gap-4 mt-4">
        <div className="md:col-span-3 w-full">
          <Flex direction="flex-col" gap="gap-0" className="pb-3">
            <Heading level={1}>올클시간표</Heading>
            <SupportingText>나만의 시간표를 만들어보세요.</SupportingText>
          </Flex>

          <TimetableTabs />

          <Card className="px-2 flex flex-col gap-2 relative overflow-hidden">
            <TimetableHeader setIsOpenModal={setIsOpenModal} />
            <TimetableComponent />
          </Card>
        </div>

        <div className="md:col-span-2 w-full">
          <div className="hidden md:block">
            <ContentPanel />
          </div>
          <div className="md:hidden">
            {bottomSheetType === 'search' && <SearchBottomSheet onCloseSearch={handleClickFiltering} />}
            {bottomSheetType === 'filter' && (
              <FilteringBottomSheet
                onCloseFiltering={handleCloseFiltering}
                filters={filters}
                setFilter={setFilter}
                resetFilter={resetFilter}
              />
            )}
            {bottomSheetType === 'edit' && <FormBottomSheet />}
            {bottomSheetType === 'Info' && <ScheduleInfoBottomSheet />}
          </div>
        </div>
        {!isMobile && (
          <>
            {bottomSheetType === 'edit' && <ScheduleFormModal />}
            {bottomSheetType === 'Info' && <ScheduleInfoModal />}
          </>
        )}
      </div>

      {isOpenModal && <EditTimetable type={isOpenModal} onClose={() => setIsOpenModal(null)} />}

      {bottomSheetType === null && (
        <div className="fixed bottom-4 right-4 z-5 md:hidden">
          <Button size="small" variant="circle" onClick={() => openBottomSheet('search')}>
            <AddWhiteSvg className="w-6 h-6 cursor-pointer" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default Timetable;

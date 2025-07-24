import TimetableComponent from '@/components/timetable/Timetable.tsx';
import DropdownSelect from '@/components/timetable/DropdownSelect.tsx';

function Timetable() {
  const yearsOptions = [
    { id: '2025-2', label: '2025학년 2학기' },
    { id: '2025-1', label: '2025학년 1학기' },
    { id: '2024-2', label: '2024학년 2학기' },
    { id: '2024-1', label: '2024학년 1학기' },
  ];
  const handleSelect = (value: string) => {
    console.log('Selected year:', value);
    // Handle year selection logic here
  };
  const handleEdit = (value: string) => {
    console.log('Edit year:', value);
    // Handle year edit logic here
  };
  const handleDelete = (value: string) => {
    console.log('Delete year:', value);
    // Handle year deletion logic here
  };
  return (
    <div className="">
      <h1>Timetable</h1>
      <p>This is the timetable page.</p>
      {/* Additional timetable content can be added here */}
      <div>
        <DropdownSelect
          initialLabel="2025학년 2학기"
          options={yearsOptions}
          onSelect={handleSelect}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      <TimetableComponent />
    </div>
  );
}

export default Timetable;

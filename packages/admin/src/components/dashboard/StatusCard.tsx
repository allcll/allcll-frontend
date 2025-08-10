import Card from '@allcll/common/components/Card';
import InfoChip from '@allcll/common/components/chip/InfoChip';

interface IStatusCard {
  title: string;
  status: string;
}

function StatusCard({ title, status }: IStatusCard) {
  return (
    <Card className="w-full max-w-[280px] h-[80px] flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <h3 className="text-md text-gray-700 font-semibold">{title}</h3>
      </div>

      <div className="flex items-center justify-between mt-2">
        <InfoChip label={status} type={status === 'ON' ? 'success' : 'error'} />
      </div>
    </Card>
  );
}

export default StatusCard;

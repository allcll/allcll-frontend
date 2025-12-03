import Card from '@allcll/common/components/Card';
import InfoChip from '@allcll/common/components/chip/InfoChip';

interface IStatusCard {
  title: string;
  status: string;
  description?: string;
}

function StatusCard({ title, status, description }: IStatusCard) {
  return (
    <Card className="w-full max-w-[100%] h-[120px] flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <h3 className="text-md text-gray-700 font-semibold">{title}</h3>
      </div>
      {description && <p className="text-sm text-gray-500">{description}</p>}

      <div className="flex items-center justify-between mt-2">
        <InfoChip label={status} type={status === 'ON' ? 'success' : 'error'} />
      </div>
    </Card>
  );
}

export default StatusCard;

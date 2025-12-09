import { Badge, Card, Heading } from '@allcll/allcll-ui';

interface IStatusCard {
  title: string;
  status: string;
  description?: string;
}

function StatusCard({ title, status, description }: IStatusCard) {
  return (
    <Card>
      <div className="flex justify-between items-start">
        <Heading level={6}>{title}</Heading>
      </div>
      {description && <p className="text-sm text-gray-500">{description}</p>}

      <div className="flex items-center justify-between mt-2">
        <Badge variant={status === 'ON' ? 'success' : 'danger'}>{status}</Badge>
      </div>
    </Card>
  );
}

export default StatusCard;

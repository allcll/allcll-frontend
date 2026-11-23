import { Badge, Card, Heading, Flex } from '@allcll/allcll-ui';

interface IStatusCard {
  title: string;
  status: string;
  description?: string;
}

function StatusCard({ title, status, description }: IStatusCard) {
  return (
    <Card>
      <Flex direction="column" align="start" justify="between">
        <Heading level={5}>{title}</Heading>

        {description && <p className="text-sm text-fg-muted">{description}</p>}

        <Badge color={status === 'ON' ? 'success' : 'danger'}>{status}</Badge>
      </Flex>
    </Card>
  );
}

export default StatusCard;

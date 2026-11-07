import { Badge } from '@allcll/allcll-ui';
import { OPERATION_TYPE_LABEL, type OperationType } from '@allcll/common';

function OperationTypeBadge({ operationType }: Readonly<{ operationType: OperationType }>) {
  return <Badge variant="primary">{OPERATION_TYPE_LABEL[operationType]}</Badge>;
}

export default OperationTypeBadge;

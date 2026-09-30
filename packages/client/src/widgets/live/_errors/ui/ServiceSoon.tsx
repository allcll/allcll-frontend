import NoneLayout from '@/shared/ui/NoneLayout';
import { ListIcon } from '@allcll/allcll-ui';

interface ServiceSoonProps {
  title?: string;
}

function ServiceSoon({ title }: ServiceSoonProps) {
  const defaultTitle = '수강여석';
  const displayTitle = title ? title : defaultTitle;

  return (
    <NoneLayout
      title={`${displayTitle} 서비스가 현재 종료되었습니다.`}
      description="서비스가 다시 제공될 예정입니다."
      icon={<ListIcon className="w-7 h-7 text-gray-400" />}
    />
  );
}

export default ServiceSoon;

import { forwardRef } from 'react';
import { Bell, type LucideProps } from 'lucide-react';

/* Lucide에는 filled variant가 없어 기존 outline 아이콘에 fill을 채우도록 설정 */
export const NotificationFilledIcon = forwardRef<SVGSVGElement, LucideProps>(
  function NotificationFilledIcon(props, ref) {
    return <Bell ref={ref} fill="currentColor" {...props} />;
  },
);

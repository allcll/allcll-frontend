import { forwardRef } from 'react';
import { Star, type LucideProps } from 'lucide-react';

/* Lucide에는 filled variant가 없어 기존 outline 아이콘에 fill을 채우도록 설정 */
export const StarFilledIcon = forwardRef<SVGSVGElement, LucideProps>(function StarFilledIcon(props, ref) {
  return <Star ref={ref} fill="currentColor" {...props} />;
});

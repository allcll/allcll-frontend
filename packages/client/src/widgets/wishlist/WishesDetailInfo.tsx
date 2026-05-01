import FavoriteButton from '@/features/filtering/ui/button/FavoriteButton.tsx';
import AlarmButton from '@/features/live/pin/ui/AlarmButton';
import { WishesInfo } from '@/shared/model/types';
import { InitWishes } from '@/entities/wishes/model/useWishes.ts';
import SubjectDetail from '@/entities/subjects/ui/SubjectDetail.tsx';
import useDetailWishes from '@/entities/subjectAggregate/model/useDetailWishes.ts';
import { Flex, Heading } from '@allcll/allcll-ui';

interface WishesDetailInfoProps {
  wishesInfo: WishesInfo;
}

function WishesDetailInfo({ wishesInfo }: WishesDetailInfoProps) {
  const { data: wishes, isPending } = useDetailWishes(wishesInfo);
  const data = wishes ?? InitWishes;

  return (
    <>
      <Flex justify="justify-between" align="items-center">
        <InlineSkeleton isPending={isPending}>
          <Heading level={1}>{data.subjectName}</Heading>
        </InlineSkeleton>

        <Flex gap="gap-2">
          <FavoriteButton subject={data} />
          <AlarmButton subject={data} />
        </Flex>
      </Flex>
      <InlineSkeleton isPending={isPending} count={3}>
        <SubjectDetail wishes={wishes} />
      </InlineSkeleton>
    </>
  );
}

function InlineSkeleton({
  isPending,
  count = 1,
  children,
}: {
  isPending: boolean;
  count?: number;
  children: React.ReactNode;
}) {
  if (isPending) {
    return (
      <div className="animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-8 bg-gray-300 rounded w-1/3 mb-1" />
        ))}
      </div>
    );
  }

  return children;
}

export default WishesDetailInfo;

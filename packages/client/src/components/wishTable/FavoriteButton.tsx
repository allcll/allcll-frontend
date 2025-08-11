import React, { useState } from 'react';
import StarIcon from '@/components/svgs/StarIcon.tsx';
import { Subject } from '@/utils/types.ts';
import useFavorites from '@/store/useFavorites';

interface IFavoriteButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  subject: Subject;
}

function FavoriteButton({ subject, className, onClick, ...props }: IFavoriteButtonProps) {
  const getIsFavorite = useFavorites(state => state.isFavorite);
  const toggleFavorite = useFavorites(state => state.toggleFavorite);
  const [isFavorite, setIsFavorite] = useState(getIsFavorite(subject.subjectId));
  const title = isFavorite ? '관심목록에서 제거' : '관심목록에 추가';

  const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsFavorite(prevState => !prevState);
    toggleFavorite(subject.subjectId);

    if (onClick) onClick(e);
  };

  return (
    <button
      className={'cursor-pointer ' + (className ?? '')}
      onClick={handleFavorite}
      title={title}
      aria-label={title}
      {...props}
    >
      <StarIcon disabled={!isFavorite} />
    </button>
  );
}

export default FavoriteButton;

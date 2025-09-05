import React from 'react';
import StarIcon from '@/components/svgs/StarIcon.tsx';
import { Subject } from '@/utils/types.ts';
import useFavorites from '@/store/useFavorites';

interface IFavoriteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  subject: Subject;
}

function FavoriteButton({ subject, className, onClick, ...props }: IFavoriteButtonProps) {
  const isFavorite = useFavorites(state => state.isFavorite(subject.subjectId));
  const toggleFavorite = useFavorites(state => state.toggleFavorite);

  const title = isFavorite ? '즐겨찾기에서 제거' : '즐겨찾기에 추가';

  const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
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

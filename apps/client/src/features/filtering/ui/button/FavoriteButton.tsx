import React from 'react';
import { Subject } from '@/shared/model/types.ts';
import useFavorites from '@/features/filtering/model/useFavorites.ts';
import { IconButton, StarFilledIcon, StarIcon } from '@allcll/allcll-ui';

interface IFavoriteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  subject: Subject;
  variant?: 'contain' | 'plain';
}

function FavoriteButton({ subject, variant = 'contain', className, onClick, ...props }: IFavoriteButtonProps) {
  const isFavorite = useFavorites(state => state.isFavorite(subject.subjectId));
  const toggleFavorite = useFavorites(state => state.toggleFavorite);

  const title = isFavorite ? '즐겨찾기에서 제거' : '즐겨찾기에 추가';

  const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggleFavorite(subject.subjectId);

    if (onClick) onClick(e);
  };

  return (
    <IconButton
      size="medium"
      variant={variant}
      onClick={handleFavorite}
      label={title}
      icon={isFavorite ? <StarFilledIcon className="text-yellow-400" /> : <StarIcon className="text-fg-subtle" />}
      aria-label={title}
      className={className}
      {...props}
    />
  );
}

export default FavoriteButton;

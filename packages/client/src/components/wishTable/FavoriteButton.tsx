import { useState } from 'react';
import StarIcon from '@/components/svgs/StarIcon.tsx';
import { Subject } from '@/utils/types.ts';
import useFavorites from '@/store/useFavorites';

interface IFavoriteButtonProps {
  subject: Subject;
}

function FavoriteButton({ subject }: IFavoriteButtonProps) {
  const getIsFavorite = useFavorites(state => state.isFavorite);
  const toggleFavorite = useFavorites(state => state.toggleFavorite);
  const [isFavorite, setIsFavorite] = useState(getIsFavorite(subject.subjectId));
  const title = isFavorite ? '관심목록에서 제거' : '관심목록에 추가';

  const handleFavorite = () => {
    setIsFavorite(prevState => !prevState);
    toggleFavorite(subject.subjectId);
  };

  return (
    <button className="cursor-pointer" onClick={handleFavorite} title={title} aria-label={title}>
      <StarIcon disabled={!isFavorite} />
    </button>
  );
}

export default FavoriteButton;

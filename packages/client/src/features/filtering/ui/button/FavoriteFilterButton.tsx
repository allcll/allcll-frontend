import { Filters } from '@/features/filtering/model/useFilterStore.ts';
import { Chip, Flex, StarFilledIcon, StarIcon } from '@allcll/allcll-ui';

interface IFavoriteFilterButton {
  favoriteOnly: boolean;
  setFilter: (key: keyof Filters, value: boolean) => void;
}

function FavoriteFilterButton({ favoriteOnly, setFilter }: IFavoriteFilterButton) {
  return (
    <Chip
      variant="filled"
      selected={favoriteOnly}
      onClick={() => setFilter('favoriteOnly', !favoriteOnly)}
      label={
        <Flex align="items-center" gap="gap-1">
          {favoriteOnly ? <StarFilledIcon className="w-4 h-4" /> : <StarIcon className="w-4 h-4" />}
          즐겨찾기
        </Flex>
      }
    />
  );
}

export default FavoriteFilterButton;

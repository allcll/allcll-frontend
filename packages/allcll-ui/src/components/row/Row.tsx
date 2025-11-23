import { RowMain } from './RowMain';
import RowCenter from './RowCenter';
import RowRight from './RowRight';
import RowLeft from './RowLeft';

export const Row = Object.assign(RowMain, {
  Left: RowLeft,
  Center: RowCenter,
  Right: RowRight,
});

export default Row;

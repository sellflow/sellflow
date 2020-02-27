import { useDimensions, ScreenSize } from './dimensions';

export const NUM_COLUMNS = {
  SMALL: 2,
  MEDIUM: 4,
  LARGE: 3,
};

export function useColumns() {
  let { screenSize } = useDimensions();
  let numColumns: number;

  switch (screenSize) {
    case ScreenSize.Medium: {
      numColumns = NUM_COLUMNS.MEDIUM;
      break;
    }
    case ScreenSize.Large: {
      numColumns = NUM_COLUMNS.LARGE;
      break;
    }
    default: {
      numColumns = NUM_COLUMNS.SMALL;
      break;
    }
  }
  return numColumns;
}

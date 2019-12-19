import { ReactNode } from 'react';

export type CarouselItem = {
  content?: ReactNode;
  image: string;
  onItemPress?: () => void;
};

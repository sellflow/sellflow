import { ReactNode } from 'react';

export type CarouselItem = {
  content?: ReactNode;
  image: string;
  onItemPress?: () => void;
};

export type IndicatorItem = {
  label: string;
  timestamp?: string;
};

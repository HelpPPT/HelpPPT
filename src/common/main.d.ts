export type SlideText = {
  slideId: string;
  slideIndex: number;
  text: string;
  isSentence?: boolean;
};

export type SlideTexts = {
  slideId: string;
  slideIndex: number;
  texts: Array<SlideText>;
};

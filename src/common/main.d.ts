export type SlideText = {
  slideId: string;
  slideIndex: number;
  text: string;
};

export type SlideTexts = {
  slideId: string;
  slideIndex: number;
  texts: Array<SlideText>;
};

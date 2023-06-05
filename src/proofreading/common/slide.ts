import { getTextsFromSlides, groupSlideTextsBySlide, splitSentences } from "../../common";
import { SlideText, SlideTexts } from "../../common/main";

export const getValidationSentences = async (): Promise<Array<SlideTexts>> => {
  const textAndSentences: Array<SlideText> = await getSentenceAndTextFromSlides();
  const groupedTextAndSentences: Array<SlideTexts> = await groupSlideTextsBySlide(textAndSentences);

  const filteredGroupedTextAndSentences: Array<SlideTexts> = groupedTextAndSentences.map((slideTexts: SlideTexts) => {
    slideTexts.texts = slideTexts.texts.filter(
      (slideText: SlideText, index, self) => index === self.findIndex((otherObj) => otherObj.text === slideText.text)
    );
    return slideTexts;
  });

  return filteredGroupedTextAndSentences;
};

const getSentenceAndTextFromSlides = async (): Promise<Array<SlideText>> => {
  const textData: Array<SlideText> = await getTextsFromSlides();
  const sentences: Array<SlideText> = await splitSentences(textData);
  return textData.concat(sentences);
};

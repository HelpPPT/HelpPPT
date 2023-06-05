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

export const getSlideTextTotalLength = async (slideIndex: number): Promise<number> =>
  await PowerPoint.run(async (context: PowerPoint.RequestContext) => {
    let totalLength = 0;

    const slides = context.presentation.slides;

    context.load(slides, "id,shapes/items/type");
    await context.sync();

    const slide = slides.items[slideIndex - 1];

    for (const shape of slide.shapes.items) {
      if (shape.type !== "GeometricShape") {
        continue;
      }

      context.load(shape, "textFrame/hasText");
      await context.sync();

      if (!shape.textFrame.hasText) {
        continue;
      }

      context.load(shape, "textFrame/textRange/text");
      await context.sync();

      totalLength += shape.textFrame.textRange.text.length;
    }

    return totalLength;
  });

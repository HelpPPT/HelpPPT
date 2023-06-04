import { SlideText, SlideTexts } from "../main";
import { splitSentences } from "./sentenceSplit";

export const getTextsFromSlides = async (): Promise<Array<SlideText>> =>
  await PowerPoint.run(async (context: PowerPoint.RequestContext) => {
    const textBuffer: Array<SlideText> = [];

    const slides = context.presentation.slides;

    context.load(slides, "id,shapes/items/type");
    await context.sync();

    for (const slideIndex in slides.items) {
      const slide = slides.items[slideIndex];

      // console.log("Slide ID:", slide.id);

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

        // shape.textFrame.textRange.text.trim().replace(/[\n\r\v]/g, "\n")
        const lines: Array<string> = shape.textFrame.textRange.text.trim().split(/[\n\r\v]/g);
        const validLines: Array<string> = lines.filter((line) => line.trim().length > 0);

        validLines.map((validLine) => {
          textBuffer.push({
            slideId: slide.id,
            slideIndex: Number(slideIndex) + 1,
            text: validLine.trim(),
          });
        });

        // console.log("Text:", shape.textFrame.textRange.text.replace(/[\n\r\v]/g, "\n"));
      }
    }
    return textBuffer;
  });

export const findAndFocusText = async (searchSlideText: SlideText) =>
  await PowerPoint.run(async (context: PowerPoint.RequestContext) => {
    const searchText = searchSlideText.text;

    const slides = context.presentation.slides;

    context.load(slides, "id,shapes/items/type");
    await context.sync();

    const slide = slides.items[searchSlideText.slideIndex - 1];

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

      const text: string = shape.textFrame.textRange.text.replace(/[\n\r\v]/g, "\n");

      if (text.includes(searchText)) {
        const [start, offset] = [text.indexOf(searchText), searchText.length];
        shape.textFrame.textRange.getSubstring(start, offset).setSelected();
        return;
      }
    }
  });

export const getSentencesFromSlides = async (): Promise<Array<SlideText>> => {
  const textData: Array<SlideText> = await getTextsFromSlides();
  const sentences: Array<SlideText> = await splitSentences(textData);
  return sentences;
};

export const groupSlideTextsBySlide = async (slideTexts: Array<SlideText>): Promise<Array<SlideTexts>> => {
  const groupedSlideTexts: Array<SlideTexts> = [];

  for (const slideText of slideTexts) {
    // just append when available
    if (groupedSlideTexts[slideText.slideIndex] !== undefined) {
      groupedSlideTexts[slideText.slideIndex].texts.push(slideText);
      continue;
    }

    groupedSlideTexts[slideText.slideIndex] = {
      slideId: slideText.slideId,
      slideIndex: slideText.slideIndex,
      texts: [slideText],
    };
  }

  return groupedSlideTexts;
};

export const getSelectedTextRange = async (): Promise<PowerPoint.TextRange> =>
  PowerPoint.run(async (context: PowerPoint.RequestContext) => {
    const textRange = context.presentation.getSelectedTextRange();
    try {
      await context.sync();
    } catch {
      return null;
    }

    textRange.load("text");
    await context.sync();

    return textRange;
  });

export const setSelectedTextRangeText = async (text: string) =>
  PowerPoint.run(async (context: PowerPoint.RequestContext) => {
    const textRange = context.presentation.getSelectedTextRange();
    try {
      await context.sync();
    } catch {
      return null;
    }

    textRange.load("text");
    await context.sync();

    textRange.text = text;
    await context.sync();
  });

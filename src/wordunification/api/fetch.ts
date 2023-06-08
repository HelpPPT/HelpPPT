import { SlideText } from "../../common/main";

export const convertToMainWord = async (searchSlideText: SlideText, main: string) =>
  await PowerPoint.run(async (context: PowerPoint.RequestContext) => {
    const original = searchSlideText.text;
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
      if (text.includes(original)) {
        const [start, offset] = [text.indexOf(original), original.length];
        const newText = text.substring(0, start) + main + text.substring(start + offset);
        shape.textFrame.textRange.text = newText;
        return;
      }
    }
  });

export type SlideText = {
  slideId: string;
  text: string;
};

export const getTextsFromSlides = async (): Promise<Array<SlideText>> =>
  await PowerPoint.run(async (context: PowerPoint.RequestContext) => {
    const textBuffer: Array<SlideText> = [];

    const slides = context.presentation.slides;

    context.load(slides, "id,shapes/items/type");
    await context.sync();

    for (const slide of slides.items) {
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

        textBuffer.push({
          slideId: slide.id,
          text: shape.textFrame.textRange.text.trim().replace(/[\n\r\v]/g, "\n"),
        });

        // console.log("Text:", shape.textFrame.textRange.text.replace(/[\n\r\v]/g, "\n"));
      }
    }
    return textBuffer;
  });

export const findAndFocusText = async (searchText: string) =>
  await PowerPoint.run(async (context: PowerPoint.RequestContext) => {
    const slides = context.presentation.slides;

    context.load(slides, "id,shapes/items/type");
    await context.sync();

    for (const slide of slides.items) {
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
    }
  });

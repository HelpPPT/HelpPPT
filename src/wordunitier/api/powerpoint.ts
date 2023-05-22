export const getTextsFromSlides = async (): Promise<Array<string>> =>
  await PowerPoint.run(async (context: PowerPoint.RequestContext) => {
    const textBuffer: Array<string> = [];

    const slides = context.presentation.slides;

    context.load(slides, "id,shapes/items/type");
    await context.sync();

    for (const slide of slides.items) {
      // console.log("Slide ID:", slide.id);

      for (const shape of slide.shapes.items) {
        if (shape.type === "Unsupported") {
          continue;
        }

        context.load(shape, "textFrame/hasText");
        await context.sync();

        if (!shape.textFrame.hasText) {
          continue;
        }

        context.load(shape, "textFrame/textRange/text");
        await context.sync();

        textBuffer.push(shape.textFrame.textRange.text.trim().replace(/[\n\r\v]/g, "\n"));

        // console.log("Text:", shape.textFrame.textRange.text.replace(/[\n\r\v]/g, "\n"));
      }
    }
    return textBuffer;
  });

export const unitifyWordAll = async (from: Array<string>, to: string) =>
  await PowerPoint.run(async (context: PowerPoint.RequestContext) => {
    console.log(`${from} -> ${to}`);

    const replaceRegex: RegExp = new RegExp(from.sort((a, b) => b.length - a.length).join("|"), "g");

    const slides = context.presentation.slides;

    context.load(slides, "id,shapes/items/type");
    await context.sync();

    for (const slide of slides.items) {
      for (const shape of slide.shapes.items) {
        if (shape.type === "Unsupported") {
          continue;
        }

        context.load(shape, "textFrame/hasText");
        await context.sync();

        if (!shape.textFrame.hasText) {
          continue;
        }

        context.load(shape, "textFrame/textRange/text");
        await context.sync();

        shape.textFrame.textRange.text = shape.textFrame.textRange.text.replace(replaceRegex, to);
      }
    }
    return await context.sync();
  });

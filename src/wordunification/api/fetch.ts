export const convertToMainWord = async (original: string, main: string) =>
  await PowerPoint.run(async (context: PowerPoint.RequestContext) => {
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

        const linesWithSplitter: Array<string> = shape.textFrame.textRange.text.trim().split(/([\n\r\v])/g);
        const validLinesWithSplitter: Array<string> = linesWithSplitter
          .map((line) => ("\r\v\n".includes(line) ? line : line.trim()))
          .filter((line) => line.length > 0);
        const changedLinesWithSplitter: Array<string> = validLinesWithSplitter.map((line) => {
          // keep separators
          if ("\r\v\n".includes(line)) {
            return line;
          }
          if (line != original) return line;
          else return main;
        });

        // replace
        shape.textFrame.textRange.text = changedLinesWithSplitter.join("");
      }
    }
  });

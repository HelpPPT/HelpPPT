import axios from "axios";

export const dongConvertLines = async (sentences: Array<string>): Promise<Object> => {
  const { data } = await axios({
    method: "POST",
    url: "https://gr7hq4lgk4.execute-api.ap-northeast-2.amazonaws.com/gejosik-proxy",
    data: { sentences },
  });

  const gejosikSentences: Object = {};
  for (const originalSentence in data) {
    if (!data[originalSentence].to_change) continue;
    if (
      data[originalSentence].original_sentence.includes("?") ||
      data[originalSentence].original_sentence.includes("!") ||
      data[originalSentence].original_sentence.includes(",")
    )
      continue;
    gejosikSentences[originalSentence] = data[originalSentence].gejosik_sentence;
  }
  return gejosikSentences;
};

export const convertToGejosik = async (original: string, gejosik: string) =>
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
          else return gejosik;
        });

        // replace
        shape.textFrame.textRange.text = changedLinesWithSplitter.join("");
      }
    }
  });

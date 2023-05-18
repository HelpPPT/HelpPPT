import axios from "axios";

export const fetchLines = async (): Promise<Array<string>> =>
  await PowerPoint.run(async (context: PowerPoint.RequestContext) => {
    let lineBuffer: Array<string> = [];

    // Get lines from PPT
    const slides: PowerPoint.SlideCollection = context.presentation.slides;
    context.load(slides, "id,shapes/items/type");
    await context.sync();

    for (const slide of slides.items) {
      for (const shape of slide.shapes.items) {
        if (shape.type !== "GeometricShape") {
          continue;
        }
        context.load(shape, "textFrame/hasText");
        await context.sync();

        if (!shape.textFrame.hasText) continue;
        context.load(shape, "textFrame/textRange/text");
        await context.sync();

        lineBuffer = [
          ...lineBuffer,
          ...shape.textFrame.textRange.text
            .trim()
            .replace(/[\n\r\v]/g, "\n")
            .split("\n"),
        ];
      }
    }

    // Validate lines whether it is empty
    const validLines: Array<string> = lineBuffer.map((line) => line.trim()).filter((line) => line.length > 0);

    return validLines;
  });

export const convertLines = async (sentences: Array<string>): Promise<Map<string, Object>> => {
  const { data } = await axios({
    method: "POST",
    url: "https://gr7hq4lgk4.execute-api.ap-northeast-2.amazonaws.com/gejosik",
    data: { sentences },
  });

  const gejosikSentences: Map<string, Object> = new Map<string, Object>();
  // morphemes 를 제외한 나머지 객체들은 모두 필요
  Object.keys(data).forEach((key) => (gejosikSentences[key] = data[key]));

  return gejosikSentences;
};

export const convertToGejosik = async (original: string, gejosik: string) =>
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
          else return gejosik;
        });

        // replace
        shape.textFrame.textRange.text = changedLinesWithSplitter.join("");
      }
    }
  });

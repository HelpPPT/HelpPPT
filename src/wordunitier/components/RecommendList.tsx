import * as React from "react";

export interface RecommendListProps {
  changedWordList: Array<string>;
  mainWord: string;
}

export const RecommendList: React.FunctionComponent<RecommendListProps> = ({ changedWordList, mainWord }) => {
  const fetchLines = async (): Promise<Array<string>> =>
    await PowerPoint.run(async (context: PowerPoint.RequestContext) => {
      let lineBuffer: Array<string> = [];

      // Get lines from PPT
      const slides: PowerPoint.SlideCollection = context.presentation.slides;
      context.load(slides, "id,shapes/items/type");
      await context.sync();

      for (const slide of slides.items) {
        for (const shape of slide.shapes.items) {
          if (shape.type === "Unsupported") continue;
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

  return <div>{fetchLines}</div>;
};

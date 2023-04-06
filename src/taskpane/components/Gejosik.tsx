import * as React from "react";
import { PrimaryButton } from "@fluentui/react";

export const Gejosik: React.FunctionComponent = () => {
  const getLinesFromSlides = async (): Promise<Array<string>> =>
    await PowerPoint.run(async (context: PowerPoint.RequestContext) => {
      let lineBuffer: Array<string> = [];

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

          lineBuffer = [
            ...lineBuffer,
            ...shape.textFrame.textRange.text
              .trim()
              .replace(/[\n\r\v]/g, "\n")
              .split("\n"),
          ];

          // console.log("Text:", shape.textFrame.textRange.text.replace(/[\n\r\v]/g, "\n"));
        }
      }

      const validLines: Array<string> = lineBuffer.map((line) => line.trim()).filter((line) => line.length > 0);
      return validLines;
    });

  return (
    <div>
      <PrimaryButton
        text="Get Texts From Slides"
        onClick={async () => {
          console.log(await getLinesFromSlides());
        }}
      />
    </div>
  );
};

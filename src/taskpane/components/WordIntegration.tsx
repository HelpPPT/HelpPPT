import * as React from "react";
import { PrimaryButton } from "@fluentui/react";

export const WordIntegration: React.FunctionComponent = () => {
  const [text, setText] = React.useState<string>("");

  const getTextsFromSlides = async (): Promise<Array<string>> =>
    await PowerPoint.run(async (context: PowerPoint.RequestContext) => {
      let newText = "";

      const slides = context.presentation.slides;

      context.load(slides, "id,shapes/items/type");
      await context.sync();

      for (const slide of slides.items) {
        console.log("Slide ID:", slide.id);

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

          newText = `${newText}\n${shape.textFrame.textRange.text.replace(/[\n\r\v]/g, "\n")}`;

          console.log("Text:", shape.textFrame.textRange.text.replace(/[\n\r\v]/g, "\n"));
        }
        console.log("\n");
      }

      setText(newText.trim());

      return context.sync();
      ["123"];
    });

  return (
    <div>
      <textarea value={text} />
      <PrimaryButton text="Get Texts From Slides" onClick={getTextsFromSlides} />
    </div>
  );
};

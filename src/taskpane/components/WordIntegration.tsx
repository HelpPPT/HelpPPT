import * as React from "react";
import { PrimaryButton } from "@fluentui/react";
import axios from "axios";

export const WordIntegration: React.FunctionComponent = () => {
  const [text, setText] = React.useState<string>("");

  const getTextsFromSlides = async (): Promise<Array<string>> =>
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

  // const clusterWords = async (text: string): Promise<Array<Array<string>>> => {
  const clusterWords = async (text: string) => {
    const { data } = await axios({
      method: "POST",
      url: "http://15.165.217.213:8000/grouping/",
      data: {
        sentence: text,
      },
    });
    setText(JSON.stringify(data));
  };

  return (
    <div>
      <textarea value={text} />
      <PrimaryButton
        text="Get Texts From Slides"
        onClick={async () => {
          const testText = (await getTextsFromSlides()).join("\n");
          await clusterWords(testText);
        }}
      />
    </div>
  );
};

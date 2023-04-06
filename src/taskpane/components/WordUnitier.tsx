import * as React from "react";
import { PrimaryButton } from "@fluentui/react";

export const WordUnitier: React.FunctionComponent = () => {
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

  const clusterWords = async (__text: string): Promise<Array<Array<string>>> => {
    // const clusterWords = async (__text: string) => {
    // const { data } = await axios({
    //   method: "POST",
    //   url: "http://15.165.217.213:8000/grouping/",
    //   data: {
    //     sentence: text,
    //   },
    // });
    const data = [
      ["자료구조", "스택", "관계"],
      ["Tree", "표현", "노드", "구조"],
      ["트리(Tree)", "비선형"],
      ["OS", "김동현", "계층적", "스터디"],
      ["스터디", "계층적"],
      ["20194147", "선형"],
      ["김동현", "계층적", "스터디"],
      ["개념", "노드", "구조"],
      ["노드", "구조"],
      ["스택", "관계"],
      ["선형", "20194147"],
      ["구조", "노드"],
      ["비선형", "트리(Tree)"],
      ["계층적", "스터디"],
      ["관계", "스택"],
      ["표현", "노드", "구조"],
    ];
    return data;
  };

  const unitifyWord = async (from: Array<string>, to: string) =>
    await PowerPoint.run(async (context: PowerPoint.RequestContext) => {
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

  return (
    <PrimaryButton
      text="단어 통일"
      style={{
        borderRadius: 6,
      }}
      onClick={async () => {
        const testText = (await getTextsFromSlides()).join("\n");
        console.log(testText);

        await clusterWords(testText);
        unitifyWord(["Tree", "스택", "관계"], "자료구조");
      }}
    />
  );
};

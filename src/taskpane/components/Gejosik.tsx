import * as React from "react";
import { PrimaryButton } from "@fluentui/react";
import GejosikDTO from "../../dto/GejosikDTO";

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

  const setLinesGejosik = async (gejosikLines: GejosikDTO) =>
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

            return gejosikLines[line] ? gejosikLines[line] : line;
          });

          // replace
          shape.textFrame.textRange.text = changedLinesWithSplitter.join("");
        }
      }
    });

  return (
    <div>
      <PrimaryButton
        text="Get Texts From Slides"
        onClick={async () => {
          setLinesGejosik({
            "OS 스터디": "123OS 스터디",
            "20194147 김동현": "12320194147 김동현",
            "트리(Tree)": "123트리(Tree)",
            "트리(Tree)의 개념 트리는 노드로 이루어진 자료구조": "123트리(Tree)의 개념 트리는 노드로 이루어진 자료구조",
            "Hello World!": "Hello 123World!",
            "스택이나 큐와 같은 선형 구조가 아닌 비선형 자료구조이다.":
              "스택이나 큐와 같은 선형 구조가 아닌 비선형 자료구123조이다.",
            "트리는 계층적 관계를 표현하는 자료구조이다.": "트리는 계층적 관계를 123표현하는 자료구조이다.",
          });
        }}
      />
    </div>
  );
};

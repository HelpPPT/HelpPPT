import * as React from "react";
import { PrimaryButton } from "@fluentui/react";
import GejosikDTO from "../../dto/GejosikDTO";
import axios from "axios";

export const Gejosik: React.FunctionComponent = () => {
  const turnIntoGejosik = async () => {
    const lines: Array<string> = await getLinesFromSlides();
    const gejosikLines: GejosikDTO = await getGejosikLines(lines);
    await setLinesGejosik(gejosikLines);
  };

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

  const getGejosikLines = async (sentences: Array<string>): Promise<GejosikDTO> => {
    const { data } = await axios({
      method: "POST",
      url: "https://gr7hq4lgk4.execute-api.ap-northeast-2.amazonaws.com/gejosik",
      data: { sentences },
    });

    const gejosikSentences: GejosikDTO = {};
    Object.keys(data).forEach((key) => (gejosikSentences[key] = data[key]["gejosik_sentence"]));

    return gejosikSentences;
  };

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
    <PrimaryButton
      text="개조식으로 변환"
      style={{
        borderRadius: 6,
      }}
      onClick={turnIntoGejosik}
    />
  );
};

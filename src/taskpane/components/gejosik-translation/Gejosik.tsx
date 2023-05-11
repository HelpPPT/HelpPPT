import * as React from "react";
import { PrimaryButton, List } from "@fluentui/react";
import { makeStyles, shorthands, Card, Text } from "@fluentui/react-components";
import GejosikDTO from "../../../dto/gejosikDTO";
import axios from "axios";
// import CandidateList from "./CandidateList";

const useStyles = makeStyles({
  container: {
    ...shorthands.gap("10px"),
    ...shorthands.padding("10px"),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  card: {
    display: "flex",
    flexGrow: "1",
  },
});

const cardData = [
  {
    id: 1,
    title: "Card 1",
    description: "This is the descri",
  },
  {
    id: 2,
    title: "Card 2",
    description: "This is the description for Card 2.",
  },
  {
    id: 3,
    title: "Card 3",
    description: "This is the description for Card 3.",
  },
];

export const Gejosik: React.FunctionComponent = () => {
  const [lines, setLines] = React.useState([]);
  const styles = useStyles();

  const init = async () => {
    console.log("Loaded!");

    const fetchedLines = await getLinesFromSlides();
    setLines(fetchedLines);
  };

  React.useEffect(() => {
    init();
  }, []);

  const turnIntoGejosik = async () => {
    const gejosikLines: GejosikDTO = await getGejosikLines(lines);
    await setLinesGejosik(gejosikLines);
  };

  const getLinesFromSlides = async (): Promise<Array<string>> =>
    await PowerPoint.run(async (context: PowerPoint.RequestContext) => {
      let lineBuffer: Array<string> = [];

      const slides: PowerPoint.SlideCollection = context.presentation.slides;

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

          console.log("Text:", shape.textFrame.textRange.text.replace(/[\n\r\v]/g, "\n"));
        }
      }

      console.log(lineBuffer);

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

  const t = lines.map((line, index) => (
    <Card className={styles.card} key={index}>
      <Text weight="semibold">원문</Text>
      <Text>{line}</Text>
      <Text weight="semibold">개조식</Text>
      <Text>{line}</Text>
    </Card>
  ));

  return <div className={styles.container}>{t}</div>;
};

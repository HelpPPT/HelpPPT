import * as React from "react";
import { Button, makeStyles } from "@fluentui/react-components";

export interface UnitifyWordProps {
  changedWordsList: Array<string>;
  mainWord: string;
  setShowRecommendList: (show: boolean) => void;
}

export const UnitifyWord: React.FunctionComponent<UnitifyWordProps> = ({
  changedWordsList,
  mainWord,
  setShowRecommendList,
}) => {
  const classes = useStyles();

  const unitifyWordAll = async (from: Array<string>, to: string) =>
    await PowerPoint.run(async (context: PowerPoint.RequestContext) => {
      console.log(`${from} -> ${to}`);

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

  const unitifyWordEach = async (from: Array<string>, to: string) =>
    await PowerPoint.run(async (context: PowerPoint.RequestContext) => {
      console.log(`${from} -> ${to}`);

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

          console.log(shape.textFrame.textRange.text);
        }
      }
    });

  return (
    <div className={classes.btn}>
      <Button onClick={() => unitifyWordAll(changedWordsList, mainWord)}>모두 변경</Button>
      <Button
        onClick={() => {
          unitifyWordEach(changedWordsList, mainWord);
          setShowRecommendList(true);
        }}
      >
        일부 변경
      </Button>
    </div>
  );
};

const useStyles = makeStyles({
  btn: { display: "flex", flexDirection: "column" },
});

import * as React from "react";
import { makeStyles, shorthands, Card, Text, Button } from "@fluentui/react-components";
import { Icon } from "@fluentui/react/lib/Icon";
import { fetchLines, convertLines } from "./fetch";

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

  reload: {
    position: "fixed",
    bottom: "30px",
    right: "25px",
  },
});

export const Gejosik: React.FunctionComponent = () => {
  const [lines, setLines] = React.useState<Map<string, Object>>(new Map<string, Object>());

  const styles = useStyles();

  const init = async () => {
    const fetchedLines: Array<string> = await fetchLines();
    const gejosikLines: Map<string, Object> = await convertLines(fetchedLines);

    setLines(gejosikLines);
  };

  React.useEffect(() => {
    init();
  }, []);

  const setLinesGejosik = async (gejosikLines: { [originalLine: string]: string }) =>
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
          console.log(shape.textFrame.textRange.text);
        }
      }
    });

  return (
    <div>
      <div className={styles.container}>
        {Object.keys(lines).map((key) => {
          const metadata = lines[key];
          const sentence = metadata["original_sentence"];
          const selected_vocab = metadata["selected_vocab"];
          const before_selected_idx = sentence.lastIndexOf(
            sentence.match(selected_vocab.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).pop()
          );
          const after_selected_idx = before_selected_idx + selected_vocab.length;

          const g_sentence = metadata["gejosik_sentence"];
          const gejosik_vocab = metadata["gejosik_vocab"];
          const g_before_selected_idx = g_sentence.lastIndexOf(
            g_sentence.match(gejosik_vocab.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          );
          const g_after_selected_idx = g_before_selected_idx + gejosik_vocab.length;

          if (sentence == g_sentence) return null;
          if (g_sentence == "") return null;

          return (
            <Card className={styles.card} key={key}>
              <Text weight="semibold">원문</Text>
              <div>
                <Text>{sentence.substring(0, before_selected_idx)}</Text>
                <Text style={{ color: "red" }}>{selected_vocab}</Text>
                <Text>{sentence.substring(after_selected_idx, sentence.length)}</Text>
              </div>
              <Text weight="semibold">개조식</Text>
              <div>
                <Text>{g_sentence.substring(0, g_before_selected_idx)}</Text>
                <Text style={{ color: "blue" }}>{gejosik_vocab}</Text>
                <Text>{g_sentence.substring(g_after_selected_idx, g_sentence.length)}</Text>
              </div>
            </Card>
          );
        })}
      </div>
      <Button
        className={styles.reload}
        appearance="subtle"
        shape="circular"
        size="large"
        icon={<Icon iconName="Refresh"></Icon>}
        onClick={() => init()}
      ></Button>
    </div>
  );
};

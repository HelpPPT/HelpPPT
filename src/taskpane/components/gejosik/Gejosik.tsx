import * as React from "react";
import { makeStyles, shorthands, Card, Text, Button } from "@fluentui/react-components";
import { ArrowClockwise24Regular } from "@fluentui/react-icons";
import { fetchLines, convertLines, convertToGejosik } from "./fetch";

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
  const [gejosikMap, setGejosikMap] = React.useState<Map<string, Object>>(new Map<string, Object>());

  const styles = useStyles();

  const init = async () => {
    const fetchedLines: Array<string> = await fetchLines();
    const t_gejosikMap: Map<string, Object> = await convertLines(fetchedLines);

    setGejosikMap(t_gejosikMap);
  };

  React.useEffect(() => {
    init();
  }, []);

  const cardList = Object.keys(gejosikMap).map((key) => {
    const gejosikEntry = gejosikMap[key];
    const original_sentence = gejosikEntry["original_sentence"];
    const selected_vocab = gejosikEntry["selected_vocab"];
    const before_selected_idx = original_sentence.lastIndexOf(
      original_sentence.match(selected_vocab.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).pop()
    );
    const after_selected_idx = before_selected_idx + selected_vocab.length;

    const gejosik_sentence = gejosikEntry["gejosik_sentence"];
    const gejosik_vocab = gejosikEntry["gejosik_vocab"];
    const g_before_selected_idx = gejosik_sentence.lastIndexOf(
      gejosik_sentence.match(gejosik_vocab.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    );
    const g_after_selected_idx = g_before_selected_idx + gejosik_vocab.length;

    if (gejosik_sentence.trim() == "" || original_sentence == gejosik_sentence) return null;

    return (
      <Card
        className={styles.card}
        key={key}
        onClick={async () => {
          await convertToGejosik(original_sentence, gejosik_sentence);
          init();
        }}
      >
        <Text weight="semibold">원문</Text>
        <div>
          <Text>{original_sentence.substring(0, before_selected_idx)}</Text>
          <Text style={{ color: "red" }}>{selected_vocab}</Text>
          <Text>{original_sentence.substring(after_selected_idx, original_sentence.length)}</Text>
        </div>
        <Text weight="semibold">개조식</Text>
        <div>
          <Text>{gejosik_sentence.substring(0, g_before_selected_idx)}</Text>
          <Text style={{ color: "blue" }}>{gejosik_vocab}</Text>
          <Text>{gejosik_sentence.substring(g_after_selected_idx, gejosik_sentence.length)}</Text>
        </div>
      </Card>
    );
  });

  return (
    <div>
      <div className={styles.container}>
        {Object.keys(cardList).every((key) => cardList[key] === null) ? <Text>Nothing To Show.</Text> : cardList}
      </div>
      <Button
        className={styles.reload}
        appearance="subtle"
        shape="circular"
        size="large"
        icon={<ArrowClockwise24Regular />}
        onClick={() => init()}
      ></Button>
    </div>
  );
};

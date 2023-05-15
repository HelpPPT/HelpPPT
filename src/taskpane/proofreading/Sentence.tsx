import { Button, Card, CardHeader, makeStyles, shorthands, Subtitle2 } from "@fluentui/react-components";
import { ChevronCircleRight48Filled } from "@fluentui/react-icons";
import React from "react";
import { SlideText } from "../common";
import InvalidMessage from "./InvalidMessage";

const useStyles = makeStyles({
  card: {
    maxWidth: "100%",
    height: "fit-content",
    ...shorthands.margin("10px"),
  },
});

type SentenceProps = {
  slideText: SlideText;
};

const Sentence: React.FC<SentenceProps> = ({ slideText }: SentenceProps) => {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <CardHeader
        header={<Subtitle2>App {slideText.slideId}</Subtitle2>}
        action={<Button appearance="subtle" icon={<ChevronCircleRight48Filled />} aria-label="Go to" />}
      />
      <InvalidMessage message={slideText.text} />
    </Card>
  );
};

export default Sentence;

import { Button, Card, CardHeader, makeStyles, shorthands, Subtitle2 } from "@fluentui/react-components";
import { ChevronCircleRight48Filled } from "@fluentui/react-icons";
import React from "react";
import { SlideText } from "../common";
import InvalidMessage from "./InvalidMessage";
import { SentenceValidationResult, validateSentence } from "./validator";

const useStyles = makeStyles({
  card: {
    maxWidth: "100%",
    height: "fit-content",
    ...shorthands.margin("10px"),
  },
  validationResult: {
    display: "flex",
    flexDirection: "column",
    rowGap: "5px",
  },
});

type SentenceProps = {
  slideText: SlideText;
};

const Sentence: React.FC<SentenceProps> = ({ slideText }: SentenceProps) => {
  const styles = useStyles();

  const validationResult: SentenceValidationResult = validateSentence(slideText);

  return validationResult.isValid ? null : (
    <Card className={styles.card}>
      <CardHeader
        header={<Subtitle2>{slideText.text}</Subtitle2>}
        action={<Button appearance="subtle" icon={<ChevronCircleRight48Filled />} aria-label="Go to" />}
      />
      <div className={styles.validationResult}>
        {validationResult.messages.map((invalidMessage, i) => (
          <InvalidMessage key={i} message={invalidMessage} />
        ))}
      </div>
    </Card>
  );
};

export default Sentence;

import { Card, CardHeader, makeStyles, shorthands, Subtitle2 } from "@fluentui/react-components";
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
    <Card className={styles.card} onClick={() => console.log(123)}>
      <CardHeader header={<Subtitle2>{slideText.text}</Subtitle2>} />
      <div className={styles.validationResult}>
        {validationResult.messages.map((invalidMessage, i) => (
          <InvalidMessage key={i} message={invalidMessage} />
        ))}
      </div>
    </Card>
  );
};

export default Sentence;

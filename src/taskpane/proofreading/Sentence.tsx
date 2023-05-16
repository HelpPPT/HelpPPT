import { Card, CardHeader, makeStyles, shorthands, Subtitle2, Text } from "@fluentui/react-components";
import React from "react";
import { selectText } from "../common";
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
    rowGap: "8px",
  },
});

type SentenceProps = {
  sentence: string;
};

const Sentence: React.FC<SentenceProps> = ({ sentence }: SentenceProps) => {
  const styles = useStyles();

  const validationResult: SentenceValidationResult = validateSentence({ slideId: "dummyIndex", text: sentence });

  return validationResult.isValid ? (
    <Text>All sentences are okay</Text>
  ) : (
    <Card className={styles.card} onClick={() => selectText(sentence)}>
      <CardHeader header={<Subtitle2>{sentence}</Subtitle2>} />
      <div className={styles.validationResult}>
        {validationResult.messages.map((invalidMessage, i) => (
          <InvalidMessage key={i} message={invalidMessage} />
        ))}
      </div>
    </Card>
  );
};

export default Sentence;

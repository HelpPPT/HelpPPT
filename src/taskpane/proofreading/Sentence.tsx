import { Card, CardHeader, makeStyles, shorthands, Subtitle2, tokens } from "@fluentui/react-components";
import React from "react";
import { findAndFocusText } from "../common";
import InvalidMessage from "./InvalidMessage";
import { SentenceValidationResult, validateSentence } from "./validator";

const useStyles = makeStyles({
  card: {
    maxWidth: "100%",
    height: "fit-content",
    ...shorthands.margin("10px"),
    ...shorthands.outline("1px", "solid", tokens.colorCompoundBrandBackground),
    "&:hover": {
      ...shorthands.outline("2px", "solid", tokens.colorCompoundBrandBackgroundHover),
    },
    "&:active": {
      ...shorthands.outline("3px", "solid", tokens.colorCompoundBrandBackgroundPressed),
    },
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

  const validationResult: SentenceValidationResult = validateSentence({
    slideId: "dummyIndex",
    slideIndex: -1,
    text: sentence,
  });

  return validationResult.isValid ? null : (
    <Card className={styles.card} onClick={() => findAndFocusText(sentence)}>
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

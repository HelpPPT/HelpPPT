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
    "&:hover": {
      backgroundColor: tokens.colorBrandBackgroundInvertedHover,
    },
    "&:active": {
      backgroundColor: tokens.colorBrandBackgroundInvertedHover,
      ...shorthands.outline("2px", "solid", tokens.colorBrandForegroundInvertedHover),
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
        {validationResult.invalidDatas.map((invalidData, i) => (
          <InvalidMessage key={i} badgeStyle={invalidData.badgeStyle} message={invalidData.message} />
        ))}
      </div>
    </Card>
  );
};

export default Sentence;

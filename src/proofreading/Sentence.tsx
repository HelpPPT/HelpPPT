import { Card, CardHeader, makeStyles, shorthands, Subtitle2, tokens } from "@fluentui/react-components";
import React from "react";
import { findAndFocusText } from "../common";
import { SlideText } from "../common/main";
import { InvalidMessage } from "./InvalidMessage";
import { SentenceValidationResult } from "./validator";

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
  slideText: SlideText;
  validationResult: SentenceValidationResult;
  gejosikData: Object;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Sentence: React.FC<SentenceProps> = ({
  slideText,
  validationResult,
  gejosikData,
  setLoading,
}: SentenceProps) => {
  const styles = useStyles();

  return validationResult.isValid ? null : (
    <Card className={styles.card} onClick={() => findAndFocusText(slideText)}>
      <CardHeader header={<Subtitle2>{slideText.text}</Subtitle2>} />
      <div className={styles.validationResult}>
        {validationResult.invalidDatas.map((invalidData, i) => (
          <InvalidMessage
            key={i}
            slideText={slideText}
            badgeStyle={invalidData.badgeStyle}
            message={invalidData.message}
            gejosikData={gejosikData}
            setLoading={setLoading}
          />
        ))}
      </div>
    </Card>
  );
};

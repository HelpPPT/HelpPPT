import React from "react";
import { Divider } from "@fluentui/react-components";
import { Sentence } from "./Sentence";
import { validateSentence } from "./validator";
import { SlideTexts } from "../common/main";
import { Card, makeStyles, shorthands, tokens } from "@fluentui/react-components";

type SlideValidationProps = {
  slideSentenceGroup: SlideTexts;
};

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
});

export const SlideValidation: React.FC<SlideValidationProps> = ({ slideSentenceGroup }: SlideValidationProps) => {
  const styles = useStyles();

  const validatedSentenceGroup = slideSentenceGroup.texts.map((sentence, index) => {
    const validationResult = validateSentence(sentence);
    return validationResult.isValid ? null : (
      <Sentence key={index} slideText={sentence} validationResult={validationResult} />
    );
  });

  // 슬라이드 자체의 validation 도 추가
  const len = slideSentenceGroup.texts.reduce((acc, cur) => {
    return acc + cur.text.length;
  }, 0);
  console.log(slideSentenceGroup.slideIndex);
  console.log(len);
  return validatedSentenceGroup.every((e) => e === null) ? null : (
    <>
      <Divider>슬라이드 {slideSentenceGroup.slideIndex}</Divider>
      {len >= 400 ? <Card className={styles.card}>슬라이드에 글자가 너무 많아요.</Card> : null}
      {validatedSentenceGroup}
    </>
  );
};

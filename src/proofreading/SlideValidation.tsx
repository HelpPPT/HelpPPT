import React, { useEffect, useState } from "react";
import { CardHeader, Divider, Subtitle2 } from "@fluentui/react-components";
import { Sentence } from "./Sentence";
import { validateSentence } from "./validator";
import { SlideTexts } from "../common/main";
import { Card, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { goToSlide } from "../common";
import { getSlideTextTotalLength } from "./common/slide";

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

const LENGTH_LIMIT = 400;

export const SlideValidation: React.FC<SlideValidationProps> = ({ slideSentenceGroup }: SlideValidationProps) => {
  const styles = useStyles();

  const [slideTextLength, setSlideTextLength] = useState<number>(0);

  useEffect(() => {
    getSlideTextTotalLength(slideSentenceGroup.slideIndex).then((slideTextLength) =>
      setSlideTextLength(slideTextLength)
    );
  }, []);

  const validatedSentenceGroup = slideSentenceGroup.texts.map((sentence, index) => {
    const validationResult = validateSentence(sentence);
    return validationResult.isValid ? null : (
      <Sentence key={index} slideText={sentence} validationResult={validationResult} />
    );
  });

  return validatedSentenceGroup.every((e) => e === null) ? null : (
    <>
      <Divider>슬라이드 {slideSentenceGroup.slideIndex}</Divider>
      {slideTextLength >= LENGTH_LIMIT ? (
        <Card className={styles.card} onClick={() => goToSlide(slideSentenceGroup.slideIndex)}>
          <CardHeader header={<Subtitle2>슬라이드에 글자가 너무 많아요.</Subtitle2>} />
        </Card>
      ) : null}
      {validatedSentenceGroup}
    </>
  );
};

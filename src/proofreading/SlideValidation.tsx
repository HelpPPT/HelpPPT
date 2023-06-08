import React, { useEffect, useState } from "react";
import { CardHeader, Divider, Subtitle2 } from "@fluentui/react-components";
import { Sentence } from "./Sentence";
import { validateSentence } from "./validator";
import { SlideTexts } from "../common/main";
import { Card, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { goToSlide } from "../common";
import { getSlideTextTotalLength } from "./common/slide";
import { useBadgeStyles } from "./common/badgeStyle";

type SlideValidationProps = {
  slideSentenceGroup: SlideTexts;
  gejosikData: Map<string, string>;
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

export const SlideValidation: React.FC<SlideValidationProps> = ({
  slideSentenceGroup,
  gejosikData,
}: SlideValidationProps) => {
  const styles = useStyles();
  const badgeStyle = useBadgeStyles();

  const [slideTextLength, setSlideTextLength] = useState<number>(0);
  const [validatedSentenceGroup, setValidatedSentenceGroup] = useState<Array<JSX.Element>>([]);

  useEffect(() => {
    const getSlideSentenceGroup = async () => {
      const validatedSentenceGroup: Array<JSX.Element> = [];
      const { texts } = slideSentenceGroup;

      for (let index = 0; index < texts.length; index++) {
        const sentence = texts[index];
        const validationResult = await validateSentence(sentence, badgeStyle);
        if (!validationResult.isValid) {
          validatedSentenceGroup.push(
            <Sentence key={index} slideText={sentence} validationResult={validationResult} />
          );
        }
      }

      return validatedSentenceGroup;
    };

    getSlideTextTotalLength(slideSentenceGroup.slideIndex).then((slideTextLength) =>
      setSlideTextLength(slideTextLength)
    );

    getSlideSentenceGroup().then((result) => setValidatedSentenceGroup(result));
  }, []);

  console.log(gejosikData);

  return validatedSentenceGroup.length === 0 ? null : (
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

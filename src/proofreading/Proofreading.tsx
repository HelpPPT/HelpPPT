import React, { useEffect } from "react";
import { getSentencesFromSlides, groupSlideTextsBySlide } from "../common";
import { SlideTexts } from "../common/main";
import { Divider, makeStyles, Spinner } from "@fluentui/react-components";
import { Sentence } from "./Sentence";

const useStyles = makeStyles({
  loader: {
    height: "100%",
  },
});

export const Proofreading: React.FC = () => {
  const styles = useStyles();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [slideSentences, setSlideSentences] = React.useState<Array<SlideTexts>>([]);

  useEffect(() => {
    getSentencesFromSlides()
      .then((sentences) => groupSlideTextsBySlide(sentences))
      .then((slideSentences) => setSlideSentences(slideSentences))
      .then(() => setLoading(false));
  }, []);

  const groupedSentences: Array<Array<JSX.Element>> = slideSentences.map((slideSentence) => [
    <Divider key={slideSentence.slideId}>슬라이드 {slideSentence.slideIndex}</Divider>,
    ...slideSentence.texts.map((sentence, index) => <Sentence key={index} slideText={sentence} />),
  ]);

  return loading ? (
    <Spinner className={styles.loader} label="문장 불러오는중..." labelPosition="below" size="huge" />
  ) : (
    <div>{...groupedSentences}</div>
  );
};

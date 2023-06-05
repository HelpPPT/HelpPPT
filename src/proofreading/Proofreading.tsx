import React, { useEffect } from "react";
import { SlideTexts } from "../common/main";
import { Divider, makeStyles, Spinner } from "@fluentui/react-components";
import { SlideValidation } from "./SlideValidation";
import { getValidationSentences } from "./common/slide";

const useStyles = makeStyles({
  loader: {
    height: "100%",
  },
});

export const Proofreading: React.FC = () => {
  const styles = useStyles();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [slidesSentenceGroup, setSlidesSentenceGroup] = React.useState<Array<SlideTexts>>([]);

  useEffect(() => {
    getValidationSentences()
      .then((slidesSentenceGroup) => setSlidesSentenceGroup(slidesSentenceGroup))
      .then(() => setLoading(false));
  }, []);

  const slidesValidations: Array<JSX.Element> = slidesSentenceGroup.map((slideSentenceGroup) => {
    return <SlideValidation key={slideSentenceGroup.slideId} slideSentenceGroup={slideSentenceGroup} />;
  });
  return loading ? (
    <Spinner className={styles.loader} label="문장 불러오는중..." labelPosition="below" size="huge" />
  ) : (
    <div>
      {...slidesValidations}
      <Divider />
    </div>
  );
};

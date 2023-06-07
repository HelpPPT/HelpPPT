import React, { useEffect } from "react";
import { SlideTexts } from "../common/main";
import { Button, Divider, makeStyles, Spinner } from "@fluentui/react-components";
import { SlideValidation } from "./SlideValidation";
import { getValidationSentences } from "./common/slide";
import { ArrowClockwise24Regular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  loader: {
    height: "100%",
  },
  reload: {
    position: "fixed",
    bottom: "30px",
    right: "25px",
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
  }, [loading]);

  const slidesValidations: Array<JSX.Element> = slidesSentenceGroup.map((slideSentenceGroup) => {
    return <SlideValidation key={slideSentenceGroup.slideId} slideSentenceGroup={slideSentenceGroup} />;
  });
  return loading ? (
    <Spinner className={styles.loader} label="문장 불러오는중..." labelPosition="below" size="huge" />
  ) : (
    <div>
      {...slidesValidations}
      <Divider />
      <Button
        className={styles.reload}
        shape="circular"
        size="large"
        icon={<ArrowClockwise24Regular />}
        onClick={() => setLoading(true)}
      ></Button>
    </div>
  );
};

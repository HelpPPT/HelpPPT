import React, { useEffect } from "react";
import { SlideTexts } from "../common/main";
import { Button, Divider, makeStyles, Spinner } from "@fluentui/react-components";
import { SlideValidation } from "./SlideValidation";
import { getValidationSentences } from "./common/slide";
import { ArrowClockwise24Regular } from "@fluentui/react-icons";
import { dongConvertLines } from "../gejosik/fetch";

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
  const [gejosikData, setGejosikData] = React.useState<Map<string, Object>>(new Map<string, Object>());

  useEffect(() => {
    if (!loading) {
      return;
    }

    getValidationSentences()
      .then(async (slidesSentenceGroup) => {
        setSlidesSentenceGroup(slidesSentenceGroup);

        const sentences: Array<string> = slidesSentenceGroup.flatMap((slideSentenceGroup) =>
          slideSentenceGroup.texts.map((sentence) => sentence.text)
        );
        const _gejosikData = await dongConvertLines(sentences);
        setGejosikData(_gejosikData);
      })
      .then(() => setLoading(false));
  }, [loading]);

  return loading ? (
    <Spinner className={styles.loader} label="문장 불러오는중..." labelPosition="below" size="huge" />
  ) : (
    <div>
      {slidesSentenceGroup.map((slideSentenceGroup) => (
        <SlideValidation key={slideSentenceGroup.slideId} slideSentenceGroup={slideSentenceGroup} />
      ))}
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

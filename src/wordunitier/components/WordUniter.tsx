import * as React from "react";
import { makeStyles, shorthands, Button } from "@fluentui/react-components";
import { Skeleton, SkeletonItem, SkeletonProps } from "@fluentui/react-components/unstable";
import { ArrowClockwise24Filled } from "@fluentui/react-icons";
import { getWordClusters } from "../../wordunitier/api/GroupingAPI";
import { getTextsFromSlides } from "../../taskpane/common";
import { SlideText } from "../../taskpane/common/main";
import { ShowClusterItem } from "./ShowClusterItem";
import axios from "axios";

export const Loading = (props: Partial<SkeletonProps>) => (
  <Skeleton {...props}>
    <SkeletonItem />
  </Skeleton>
);

export const WordUnitier: React.FC = () => {
  const [wordClusters, setWordClusters] = React.useState<Array<Array<string>>>([]);
  const classes = useStyles();

  React.useEffect(() => {
    getClusters();
  }, []);

  const getClusters = async () => {
    const textData: Array<SlideText> = await getTextsFromSlides();

    let splittedSentences: Array<SlideText> = [];

    // TODO: poor performance, need improvement
    for (const textDatum of textData) {
      const splits: Array<string> = await splitSentences([textDatum.text]);
      splits.forEach((split) => {
        splittedSentences = [
          ...splittedSentences,
          { text: split, slideId: textDatum.slideId, slideIndex: textDatum.slideIndex },
        ];
      });
    }

    const sentences: string[] = splittedSentences.map((sentence) => sentence["text"]);

    console.log(sentences);
    const clusters: Array<Array<string>> = await getWordClusters(sentences);
    setWordClusters(clusters);
  };

  const splitSentences = async (sentences: Array<string>): Promise<Array<string>> => {
    const { data } = await axios({
      method: "POST",
      url: "https://gd35659rx1.execute-api.ap-northeast-2.amazonaws.com/default/SentenceSplitter",
      data: { sentences },
    });
    return data.sentences;
  };

  return (
    <div className={classes.clusterList}>
      {wordClusters.length > 0 ? (
        wordClusters.map((cluster, cluster_idx) => (
          <ShowClusterItem key={cluster_idx} cluster={cluster} cluster_idx={cluster_idx} />
        ))
      ) : (
        <Loading />
      )}
      <Button
        className={classes.refreshBtn}
        shape="circular"
        appearance="subtle"
        size="large"
        icon={<ArrowClockwise24Filled />}
        onClick={() => {
          getClusters();
        }}
      ></Button>
    </div>
  );
};

const useStyles = makeStyles({
  clusterList: {
    ...shorthands.gap("10px"),
    ...shorthands.padding("10px"),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  refreshBtn: { position: "fixed", bottom: "5px", right: "5px" },
});

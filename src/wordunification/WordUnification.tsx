import * as React from "react";
import {
  makeStyles,
  shorthands,
  Button,
  SkeletonProps,
  Skeleton,
  SkeletonItem,
  Card,
} from "@fluentui/react-components";
import { ArrowClockwise24Filled } from "@fluentui/react-icons";
import { getWordClusters } from "./api/grouping";
import { getSentencesFromSlides } from "../common";
import { SlideText } from "../common/main";
import { ShowClusterItem } from "./ShowClusterItem";

const useSkeletonStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },

  skeletonCard: {
    ...shorthands.margin(0, 0, "10px", 0),
  },

  secondRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },

  subCard: {
    width: "45%",
  },
});

export const Loading = (props: Partial<SkeletonProps>) => {
  const styles = useSkeletonStyles();

  return (
    <Skeleton {...props}>
      {Array.from(Array(5), (_, i) => (
        <Card key={i} className={styles.skeletonCard}>
          <SkeletonItem size={28} />
          <div className={styles.secondRow}>
            <Card className={styles.subCard}>
              <SkeletonItem size={24} />
              <SkeletonItem size={24} />
              <SkeletonItem size={24} />
            </Card>
            <Card className={styles.subCard}>
              <SkeletonItem size={24} />
              <SkeletonItem size={24} />
              <SkeletonItem size={24} />
            </Card>
          </div>
        </Card>
      ))}
    </Skeleton>
  );
};

const WordUnification: React.FC = () => {
  const [wordClusters, setWordClusters] = React.useState<Array<Array<string>>>([]);
  const classes = useStyles();

  React.useEffect(() => {
    getClusters();
  }, []);

  const getClusters = async () => {
    const slideSentences: Array<SlideText> = await getSentencesFromSlides();
    const sentences: string[] = slideSentences.map((sentence) => sentence.text);
    // const clusters: Array<Array<string>> = await getWordClusters(sentences, false, null);
    const clusters: Array<Array<string>> = await getWordClusters(sentences, true, "computer");
    setWordClusters(clusters);
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
      <Button // 새로고침 버튼
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

export default WordUnification;

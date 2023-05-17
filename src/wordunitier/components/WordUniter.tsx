import * as React from "react";
import { makeStyles, shorthands, Button } from "@fluentui/react-components";
import { Skeleton, SkeletonItem, SkeletonProps } from "@fluentui/react-components/unstable";
import { ArrowClockwise24Filled } from "@fluentui/react-icons";
import { getWordClusters } from "../../wordunitier/api/GroupingAPI";
import { getTextsFromSlides } from "../api/PowerpointAPI";
import { ShowClusterItem } from "./ShowClusterItem";

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
    const fullSentence: string = (await getTextsFromSlides()).join("\n");
    const clusters: Array<Array<string>> = await getWordClusters(fullSentence);
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

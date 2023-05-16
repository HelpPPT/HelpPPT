import * as React from "react";
import { Accordion, makeStyles } from "@fluentui/react-components";
import { getWordClusters } from "../../wordunitier/api/GroupingAPI";
import { getTextsFromSlides } from "../api/PowerpointAPI";
import { ShowAccordionItem } from "./showAccordionItem";

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
        <Accordion collapsible multiple defaultOpenItems="all">
          {wordClusters.map((cluster, cluster_idx) => (
            <ShowAccordionItem key={cluster_idx} cluster={cluster} cluster_idx={cluster_idx} />
          ))}
        </Accordion>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

const useStyles = makeStyles({
  clusterList: { marginTop: "1em", display: "flex", flexDirection: "column" },
});

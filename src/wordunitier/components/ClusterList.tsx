import * as React from "react";
import { Accordion } from "@fluentui/react-components";
import { ShowAccordionItem } from "./showAccordionItem";

export interface ClusterListProps {
  wordClusters: Array<Array<string>>;
}

export const ClusterList: React.FunctionComponent<ClusterListProps> = ({ wordClusters }) => {
  return (
    <div>
      <Accordion collapsible multiple defaultOpenItems="all">
        {wordClusters.map((cluster, cluster_idx) => (
          <ShowAccordionItem key={cluster_idx} cluster={cluster} cluster_idx={cluster_idx} />
        ))}
      </Accordion>
    </div>
  );
};

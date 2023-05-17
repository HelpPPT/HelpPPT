import * as React from "react";
import { Card, makeStyles, shorthands } from "@fluentui/react-components";
import { CheckBoxList } from "./CheckBoxList";
import { MainWordList } from "./MainWordList";
import { RecommendList } from "./RecommendList";

export interface ShowClusterItemProps {
  cluster: Array<string>;
  cluster_idx: number;
}

export const ShowClusterItem: React.FC<ShowClusterItemProps> = ({ cluster, cluster_idx }) => {
  const classes = useStyles();
  const [checkedItems, setCheckedItems] = React.useState([]);
  const [mainWord, setMainWord] = React.useState("");

  return (
    <Card key={cluster_idx} className={classes.card}>
      <header>
        <b>그룹 {cluster_idx + 1}</b>
      </header>
      <div className={classes.gridRow}>
        <CheckBoxList cluster={cluster} checkedItems={checkedItems} onChecked={setCheckedItems} />
        <MainWordList cluster={cluster} changedMainWord={setMainWord} />
      </div>
      {mainWord !== "" && checkedItems.length > 0 && (
        <RecommendList changedWordList={checkedItems} mainWord={mainWord} />
      )}
    </Card>
  );
};

const useStyles = makeStyles({
  card: { display: "flex", flexDirection: "column" },
  gridRow: {
    ...shorthands.gap("10px"),
    display: "flex",
    justifyContent: "stretch",
    flexGrow: 1,
    alignItems: "stretch",
  },
  colItems: { display: "flex", flexDirection: "column", alignItems: "stretch" },
});

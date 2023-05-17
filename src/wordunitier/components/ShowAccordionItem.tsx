import * as React from "react";
import { AccordionHeader, AccordionItem, AccordionPanel, makeStyles } from "@fluentui/react-components";
import { CheckBoxList } from "./CheckBoxList";
import { MainWordList } from "./MainWordList";
import { UnitifyWord } from "./UnitifyWord";
import { RecommendList } from "./RecommendList";
export interface ShowAccordionItemProps {
  cluster: Array<string>;
  cluster_idx: number;
}

export const ShowAccordionItem: React.FunctionComponent<ShowAccordionItemProps> = ({ cluster, cluster_idx }) => {
  const classes = useStyles();
  const [checkedItems, setCheckedItems] = React.useState([]);
  const [mainWord, setMainWord] = React.useState("");
  const [showRecommendList, setShowRecommendList] = React.useState(false);

  return (
    <AccordionItem value={cluster_idx}>
      <AccordionHeader>그룹 {cluster_idx + 1}</AccordionHeader>
      <AccordionPanel className={classes.items}>
        <div className={classes.items}>
          <CheckBoxList cluster={cluster} checkedItems={checkedItems} onChecked={setCheckedItems} />
          <MainWordList cluster={cluster} changedMainWord={setMainWord} />
          <UnitifyWord
            changedWordsList={checkedItems}
            mainWord={mainWord}
            setShowRecommendList={setShowRecommendList}
          />
          {showRecommendList && <RecommendList changedWordList={checkedItems} mainWord={mainWord} />}
        </div>
      </AccordionPanel>
    </AccordionItem>
  );
};

const useStyles = makeStyles({
  items: { display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "stretch" },
});

import * as React from "react";
import { Button, makeStyles } from "@fluentui/react-components";
import { unitifyWordAll } from "../api/PowerpointAPI";

export interface UnitifyWordProps {
  changedWordsList: Array<string>;
  mainWord: string;
  setShowRecommendList: (show: boolean) => void;
}

export const UnitifyWord: React.FC<UnitifyWordProps> = ({ changedWordsList, mainWord, setShowRecommendList }) => {
  const classes = useStyles();

  return (
    <div className={classes.btn}>
      <Button onClick={() => unitifyWordAll(changedWordsList, mainWord)}>모두 변경</Button>
      <Button
        onClick={() => {
          setShowRecommendList(true);
        }}
      >
        일부 변경
      </Button>
    </div>
  );
};

const useStyles = makeStyles({
  btn: { display: "flex", flexDirection: "column" },
});

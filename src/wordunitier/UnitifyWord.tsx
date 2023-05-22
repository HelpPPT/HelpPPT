import * as React from "react";
import { Button, makeStyles } from "@fluentui/react-components";
import { unitifyWordAll } from "./api/powerpoint";

export interface UnitifyWordProps {
  changedWordsList: Array<string>;
  mainWord: string;
}

export const UnitifyWord: React.FC<UnitifyWordProps> = ({ changedWordsList, mainWord }) => {
  const classes = useStyles();

  return (
    <div className={classes.btn}>
      <Button onClick={() => unitifyWordAll(changedWordsList, mainWord)}>모두 변경</Button>
      <Button>일부 변경</Button>
    </div>
  );
};

const useStyles = makeStyles({
  btn: { display: "flex", flexDirection: "column" },
});

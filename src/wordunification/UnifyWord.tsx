import * as React from "react";
import { Button, makeStyles } from "@fluentui/react-components";
import { unifyWordAll } from "./api/powerpoint";

export interface UnifyWordProps {
  changedWordsList: Array<string>;
  mainWord: string;
}

export const UnifyWord: React.FC<UnifyWordProps> = ({ changedWordsList, mainWord }) => {
  const classes = useStyles();

  return (
    <div className={classes.btn}>
      <Button onClick={() => unifyWordAll(changedWordsList, mainWord)}>모두 변경</Button>
      <Button>일부 변경</Button>
    </div>
  );
};

const useStyles = makeStyles({
  btn: { display: "flex", flexDirection: "column" },
});

import * as React from "react";
import { Card, Checkbox, makeStyles, shorthands } from "@fluentui/react-components";

export interface CheckBoxListProps {
  cluster: Array<string>;
  checkedItems: Array<string>;
  onChecked: (items: any) => void;
}

export const CheckBoxList: React.FunctionComponent<CheckBoxListProps> = ({ cluster, checkedItems, onChecked }) => {
  const classes = useStyles();

  const handleCheckboxChange = (word: string) => {
    onChecked((prevCheckedItems) => {
      let updatedCheckedItems = [...prevCheckedItems];

      if (prevCheckedItems.includes(word)) {
        updatedCheckedItems = prevCheckedItems.filter((val) => val !== word);
      } else {
        updatedCheckedItems = [...prevCheckedItems, word];
      }

      return updatedCheckedItems;
    });
  };

  return (
    <Card className={classes.card}>
      <header>
        <b>후보 단어</b>
      </header>
      <div className={classes.checkBox}>
        {cluster.map((word, word_idx) => (
          <Checkbox
            key={word_idx}
            checked={checkedItems.includes(word)}
            onChange={() => handleCheckboxChange(word)}
            label={word}
          />
        ))}
      </div>
    </Card>
  );
};

const useStyles = makeStyles({
  card: {
    ...shorthands.gap("5px"),
    ...shorthands.margin("10px"),
    display: "flex",
    flexGrow: 1,
  },
  checkBox: { display: "flex", flexDirection: "column", flexGrow: 1 },
});

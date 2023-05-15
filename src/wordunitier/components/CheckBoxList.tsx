import * as React from "react";
import { Checkbox, makeStyles } from "@fluentui/react-components";

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
    <div className={classes.checkbox}>
      {cluster.map((word, word_idx) => (
        <Checkbox
          key={word_idx}
          checked={checkedItems.includes(word)}
          onChange={() => handleCheckboxChange(word)}
          label={word}
        />
      ))}
    </div>
  );
};

const useStyles = makeStyles({
  checkbox: { display: "flex", flexDirection: "column", marginRight: "7px" },
});

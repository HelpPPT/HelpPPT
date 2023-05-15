import * as React from "react";
import { Input, ToggleButton, useId, makeStyles } from "@fluentui/react-components";

export interface MainWordListProps {
  cluster: Array<string>;
  changedMainWord: (item: string) => void;
}

export const MainWordList: React.FunctionComponent<MainWordListProps> = ({ cluster, changedMainWord }) => {
  const [selectedToggleIndex, setSelectedToggleIndex] = React.useState(-1);
  const [buttonCheckedList, setButtonCheckedList] = React.useState(Array(cluster.length).fill(true));
  const inputId = useId("input-with-placeholder");
  const classes = useStyles();

  const handleToggleClick = (index: number, word: string) => {
    setSelectedToggleIndex(index);
    changedMainWord(word);
  };

  const handleInputChange = (word: string) => {
    setSelectedToggleIndex(-1);
    changedMainWord(word);
    setButtonCheckedList(Array(cluster.length).fill(false));
  };

  return (
    <div className={classes.togglebtn}>
      {cluster.map((word, word_idx) => (
        <ToggleButton
          key={word_idx}
          onClick={() => handleToggleClick(word_idx, word)}
          checked={buttonCheckedList[word_idx]}
          style={{ backgroundColor: selectedToggleIndex === word_idx ? "#EBEBEB" : "transparent" }}
        >
          {word}
        </ToggleButton>
      ))}
      {/* <Input placeholder="바꿀 단어" id={inputId} onChange={(e) => changedMainWord(e.target.value)} /> */}
      <Input placeholder="바꿀 단어" id={inputId} onChange={(e) => handleInputChange(e.target.value)} />
    </div>
  );
};

const useStyles = makeStyles({
  togglebtn: { display: "flex", flexDirection: "column", marginRight: "7px" },
});

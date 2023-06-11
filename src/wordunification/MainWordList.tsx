import * as React from "react";
import { Card, Input, ToggleButton, useId, makeStyles, shorthands, tokens } from "@fluentui/react-components";

export interface MainWordListProps {
  cluster: Array<string>;
  changedMainWord: (item: string) => void;
}

export const MainWordList: React.FunctionComponent<MainWordListProps> = ({ cluster, changedMainWord }) => {
  const [selectedToggleIndex, setSelectedToggleIndex] = React.useState(-1);
  const [buttonCheckedList, setButtonCheckedList] = React.useState(Array(cluster.length).fill(true));
  const [customMainWord, setCustomMainWord] = React.useState("");
  const inputId = useId("input-with-placeholder");
  const classes = useStyles();

  const handleToggleClick = (index: number, word: string) => {
    setSelectedToggleIndex(index);
    setCustomMainWord("");
    changedMainWord(word);
  };

  const handleInputChange = (word: string) => {
    setSelectedToggleIndex(-1);
    setCustomMainWord(word);
    changedMainWord(word);
    setButtonCheckedList(Array(cluster.length).fill(false));
  };

  return (
    <Card className={classes.card}>
      <header>
        <b>대체 단어</b>
      </header>
      <div className={classes.btnList}>
        {cluster.map((word, word_idx) => (
          <ToggleButton
            key={word_idx}
            className={classes.toggleBtn}
            onClick={() => handleToggleClick(word_idx, word)}
            checked={buttonCheckedList[word_idx]}
            style={{
              backgroundColor:
                selectedToggleIndex === word_idx ? tokens.colorBrandBackgroundInvertedHover : "transparent",
            }}
          >
            {word}
          </ToggleButton>
        ))}
        <Input
          className={classes.inputBox}
          placeholder="바꿀 단어"
          id={inputId}
          value={customMainWord}
          onChange={(e) => handleInputChange(e.target.value)}
        />
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
  btnList: { display: "flex", flexDirection: "column" },
  toggleBtn: {
    ...shorthands.gap("5px"),
    ...shorthands.margin("5px"),
    display: "flex",
    "&:hover": {
      backgroundColor: tokens.colorBrandBackgroundInvertedHover,
    },
  },
  activeBtn: {
    backgroundColor: tokens.colorBrandBackgroundInvertedHover,
  },
  inputBox: { ...shorthands.gap("5px"), ...shorthands.margin("5px") },
});

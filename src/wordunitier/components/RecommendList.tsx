import * as React from "react";
import { Card, Text, makeStyles, Button, shorthands } from "@fluentui/react-components";
import { fetchLines, convertToGejosik } from "../../gejosik/fetch";
import { unitifyWordAll } from "../api/PowerpointAPI";

export interface RecommendListProps {
  changedWordList: Array<string>;
  mainWord: string;
}

export const RecommendList: React.FC<RecommendListProps> = ({ changedWordList, mainWord }) => {
  const classes = useStyles();
  const [beforeLinesMap, setBeforeLinesMap] = React.useState<
    Array<{ line: string; index: { start: number; end: number } }>
  >([]);
  const [hiddenCardIndexes, setHiddenCardIndexes] = React.useState<number[]>([]);

  const pattern = new RegExp(`(${changedWordList.join("|")})`, "g");

  React.useEffect(() => {
    const initData = async () => {
      const lines: Array<string> = await fetchLines();
      const validLines = checkedLinesValid(lines);
      const resultsMapList = await getValidLinesMap(validLines);
      setBeforeLinesMap(resultsMapList);
    };

    initData();
  }, [changedWordList]);

  const getValidLinesMap = async (lines: Array<string>) => {
    let resultsMapList = [];
    for (const line of lines) {
      const indexes = findMatchIndexes(line);
      const resultsMap = indexes.map((index) => ({ line, index }));
      resultsMapList = resultsMapList.concat(resultsMap);
    }
    return resultsMapList;
  };

  const checkedLinesValid = (lines: Array<string>) => {
    return lines.filter((line) => changedWordList.some((word) => line.includes(word)));
  };

  const findMatchIndexes = (line: string) => {
    const indexes = [];
    let match;
    while ((match = pattern.exec(line)) !== null) {
      indexes.push({ start: match.index, end: pattern.lastIndex });
    }
    return indexes;
  };

  const convertLine = (line: string, index: { start: number; end: number }) => {
    const prefix = line.substring(0, index["start"]); // 변경 대상 단어 앞의 문자열
    const suffix = line.substring(index["end"]); // 변경 대상 단어 뒤의 문자열
    const modifiedSentence = prefix + mainWord + suffix; // 변경된 문자열 생성
    return modifiedSentence;
  };

  const handleCardClick = async (index: { start: number; end: number }, line: string, cardIndex: number) => {
    await convertToGejosik(line, convertLine(line, index));
    setHiddenCardIndexes((prevIndexes) => [...prevIndexes, cardIndex]);
  };

  return (
    <div className={classes.colItems}>
      <Button className={classes.allChangeBtn} onClick={() => unitifyWordAll(changedWordList, mainWord)}>
        모두 변경
      </Button>

      {beforeLinesMap.map(({ line, index }, cardIndex) => {
        if (hiddenCardIndexes.includes(cardIndex)) {
          return null;
        }
        return (
          <Card key={cardIndex} className={classes.card} onClick={() => handleCardClick(index, line, cardIndex)}>
            <div>
              <Text>{line.slice(0, index["start"])}</Text>
              <Text underline className={classes.highlight}>
                {line.slice(index["start"], index["end"])}
              </Text>
              <Text>{line.slice(index["end"])}</Text>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

const useStyles = makeStyles({
  card: { ...shorthands.gap("10px"), ...shorthands.margin("5px"), display: "flex" },
  highlight: {
    backgroundColor: "#ECF5FF",
    textDecorationColor: "#6B89E5",
  },
  allChangeBtn: { backgroundColor: "#6B89E5", color: "white", ...shorthands.margin("5px"), alignItems: "center" },
  colItems: { display: "flex", flexDirection: "column" },
});

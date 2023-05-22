import * as React from "react";
import { Card, Text, makeStyles, Button, shorthands } from "@fluentui/react-components";
import { convertToGejosik } from "../gejosik/fetch";
import { unifyWordAll } from "./api/powerpoint";
import { getTextsFromSlides } from "../common";
import { SlideText } from "../common/main";
import { splitSentences } from "./api/fetch";

export interface RecommendListProps {
  changedWordList: Array<string>;
  mainWord: string;
}

export interface RecommendSentenceProps {
  slideId: string;
  slideIndex: number;
  text: string;
  index: { start: number; end: number };
}

export const RecommendList: React.FC<RecommendListProps> = ({ changedWordList, mainWord }) => {
  const classes = useStyles();
  const [sentencesMap, setSentencesMap] = React.useState<Array<RecommendSentenceProps>>([]);
  const [hiddenCardIndexes, setHiddenCardIndexes] = React.useState<number[]>([]);

  const pattern = new RegExp(`(${changedWordList.join("|")})`, "g");

  React.useEffect(() => {
    const initData = async () => {
      const rawLine: Array<SlideText> = await fetchSentences();
      const validLines: Array<SlideText> = checkedLinesValid(rawLine);
      const resultsMapList: Array<RecommendSentenceProps> = await getValidLinesMap(validLines);
      setSentencesMap(resultsMapList);
    };

    initData();
  }, [changedWordList]);

  const fetchSentences = async () => {
    const textData: Array<SlideText> = await getTextsFromSlides();

    let splittedSentences: Array<SlideText> = [];

    for (const textDatum of textData) {
      const splits: Array<string> = await splitSentences([textDatum.text]);
      splits.forEach((split) => {
        splittedSentences = [
          ...splittedSentences,
          { text: split, slideId: textDatum.slideId, slideIndex: textDatum.slideIndex },
        ];
      });
    }

    return splittedSentences;
  };

  const checkedLinesValid = (lines: Array<SlideText>) => {
    return lines.filter((line) => changedWordList.some((word) => line.text.includes(word)));
  };

  const getValidLinesMap = async (lines: Array<SlideText>) => {
    let resultsMapList: Array<RecommendSentenceProps> = [];

    for (const line of lines) {
      const indexes = findMatchIndexes(line.text);
      const resultsMap = indexes.map((index) => ({
        text: line.text,
        slideId: line.slideId,
        slideIndex: line.slideIndex,
        index: index,
      }));
      resultsMapList.push(...resultsMap);
    }

    return resultsMapList;
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
      <Button className={classes.allChangeBtn} onClick={() => unifyWordAll(changedWordList, mainWord)}>
        모두 변경
      </Button>

      {sentencesMap.map(({ line, index }, cardIndex) => {
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

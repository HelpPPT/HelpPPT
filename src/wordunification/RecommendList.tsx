import * as React from "react";
import { Card, Text, makeStyles, Button, shorthands, tokens, Divider } from "@fluentui/react-components";
import { unifyWordAll } from "./api/powerpoint";
import { findAndFocusText, getSentencesFromSlides, groupSlideTextsBySlide } from "../common";
import { SlideText, SlideTexts } from "../common/main";
import { convertToMainWord } from "./api/fetch";

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
  const [groupedSentencesMap, setGroupedSentencesMap] = React.useState<Array<Array<RecommendSentenceProps>>>([]);
  const [hiddenCardIndexes, setHiddenCardIndexes] = React.useState<number[]>([]);

  const pattern = new RegExp(`(${changedWordList.join("|")})`, "g");

  React.useEffect(() => {
    const initData = async () => {
      const rawLine: Array<SlideText> = await getSentencesFromSlides();
      const validLines: Array<SlideText> = checkedLinesValid(rawLine);
      const gruopedValidLines: Array<SlideTexts> = await groupSlideTextsBySlide(validLines);
      const resultsMapList: Array<Array<RecommendSentenceProps>> = await getValidLinesMap(gruopedValidLines);
      setGroupedSentencesMap(resultsMapList);
    };

    initData();
  }, [changedWordList]);

  const checkedLinesValid = (lines: Array<SlideText>) => {
    return lines.filter((line) => changedWordList.some((word) => line.text.includes(word)));
  };

  const getValidLinesMap = async (groupedLines: Array<SlideTexts>): Promise<Array<Array<RecommendSentenceProps>>> => {
    const groupedResultMapList: Array<Array<RecommendSentenceProps>> = [];

    for (const groupedLine of groupedLines) {
      if (!groupedLine) {
        continue;
      }

      const resultsMapList: Array<RecommendSentenceProps> = [];

      for (const line of groupedLine.texts) {
        const indexes = findMatchIndexes(line.text);
        const resultsMap = indexes.map((index) => ({
          ...line,
          index: index,
        }));
        resultsMapList.push(...resultsMap);
      }

      groupedResultMapList[groupedLine.slideIndex] = resultsMapList;
    }

    return groupedResultMapList;
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

  const handleCardClick = async (sentenceData: RecommendSentenceProps, cardIndex: number) => {
    const convertSentence = convertLine(sentenceData.text, sentenceData.index);
    await convertToMainWord(sentenceData.text, convertSentence);
    setHiddenCardIndexes((prevIndexes) => [...prevIndexes, cardIndex]);
    findAndFocusText({ text: convertSentence, slideId: sentenceData.slideId, slideIndex: sentenceData.slideIndex });
  };

  return (
    <div className={classes.colItems}>
      <Button className={classes.allChangeBtn} onClick={() => unifyWordAll(changedWordList, mainWord)}>
        모두 변경
      </Button>

      {groupedSentencesMap.map((sentencesMap, slideIndex) => [
        <Divider key={sentencesMap[0].slideId}>슬라이드 {slideIndex}</Divider>,
        ...sentencesMap.map((sentenceData, i) => {
          if (hiddenCardIndexes.includes(i)) {
            return null;
          }

          return (
            <Card key={i} className={classes.card} onClick={() => handleCardClick(sentenceData, i)}>
              <div>
                <Text>{sentenceData.text.slice(0, sentenceData.index["start"])}</Text>
                <Text underline className={classes.highlight}>
                  {sentenceData.text.slice(sentenceData.index["start"], sentenceData.index["end"])}
                </Text>
                <Text>{sentenceData.text.slice(sentenceData.index["end"])}</Text>
              </div>
            </Card>
          );
        }),
      ])}
    </div>
  );
};

const useStyles = makeStyles({
  card: {
    ...shorthands.gap("10px"),
    ...shorthands.margin("5px"),
    display: "flex",
    "&:hover": {
      backgroundColor: tokens.colorBrandBackgroundInvertedHover,
    },
    "&:active": {
      backgroundColor: tokens.colorBrandBackgroundInvertedHover,
      ...shorthands.outline("2px", "solid", tokens.colorBrandForegroundInvertedHover),
    },
  },
  highlight: {
    backgroundColor: tokens.colorBrandBackgroundInvertedHover,
    textDecorationColor: tokens.colorBrandForegroundInvertedHover,
  },
  allChangeBtn: {
    backgroundColor: tokens.colorBrandForegroundInverted,
    color: "white",
    ...shorthands.margin("5px"),
    alignItems: "center",
    "&:hover": {
      backgroundColor: tokens.colorBrandForegroundOnLightHover,
      color: "white",
    },
    "&:active": {
      backgroundColor: tokens.colorBrandForegroundInverted,
      color: "white",
    },
  },
  colItems: { display: "flex", flexDirection: "column" },
});

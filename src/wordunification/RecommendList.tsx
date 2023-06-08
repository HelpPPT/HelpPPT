import * as React from "react";
import { Card, Text, makeStyles, Button, shorthands, tokens, Divider, Spinner } from "@fluentui/react-components";
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
  const [hiddenCardIndexes, setHiddenCardIndexes] = React.useState<Array<{ slideIndex: number; cardIndex: number }>>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const pattern = new RegExp(`(${changedWordList.join("|")})`, "g");

  React.useEffect(() => {
    const initData = async () => {
      const rawLine: Array<SlideText> = await getSentencesFromSlides();
      const validLines: Array<SlideText> = checkedLinesValid(rawLine);
      const gruopedValidLines: Array<SlideTexts> = await groupSlideTextsBySlide(validLines);
      const resultsMapList: Array<Array<RecommendSentenceProps>> = await getValidLinesMap(gruopedValidLines);
      setGroupedSentencesMap(resultsMapList);
      setIsLoading(false);
    };

    initData();
    // }, [changedWordList]);
  }, [changedWordList, hiddenCardIndexes]);

  const checkedLinesValid = (lines: Array<SlideText>) => {
    return lines.filter((line) => changedWordList.some((word) => line.text.toLowerCase().includes(word)));
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
    while ((match = pattern.exec(line.toLowerCase())) !== null) {
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

  const handleCardClick = async (
    sentenceData: RecommendSentenceProps,
    cardIndex: { slideIndex: number; cardIndex: number }
  ) => {
    const convertSentence = convertLine(sentenceData.text, sentenceData.index);
    await convertToMainWord(
      { text: sentenceData.text, slideId: sentenceData.slideId, slideIndex: sentenceData.slideIndex },
      convertSentence
    );
    findAndFocusText({ text: convertSentence, slideId: sentenceData.slideId, slideIndex: sentenceData.slideIndex });
    setHiddenCardIndexes((prevIndexes) => [
      ...prevIndexes,
      { slideIndex: cardIndex.slideIndex, cardIndex: cardIndex.cardIndex },
    ]);
    setIsLoading(true);
  };

  return (
    <div className={classes.colItems}>
      <Button className={classes.allChangeBtn} onClick={() => unifyWordAll(changedWordList, mainWord)}>
        모두 변경
      </Button>

      {isLoading && (
        <div className={classes.overlay}>
          <Spinner />
          <Text weight="semibold" className={classes.text}>
            Loading...
          </Text>
        </div>
      )}

      {groupedSentencesMap.map((sentencesMap, slideIndex) => [
        <Divider key={sentencesMap[0].slideId}>슬라이드 {slideIndex}</Divider>,
        ...sentencesMap.map((sentenceData, i) => {
          const cardIndex = { slideIndex: slideIndex, cardIndex: i };

          if (
            hiddenCardIndexes.some(
              (hiddenIndex) => hiddenIndex.slideIndex === slideIndex && hiddenIndex.cardIndex === i
            )
          ) {
            return null; // 해당 인덱스의 카드는 렌더링하지 않음
          }

          return (
            <Card key={i} className={classes.card} onClick={() => handleCardClick(sentenceData, cardIndex)}>
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
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  text: {
    color: "white",
    ...shorthands.margin("5px"),
  },
});

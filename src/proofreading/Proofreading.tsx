import React, { useEffect } from "react";
import { getTextsFromSlides, splitSentences } from "../common";
import { SlideText } from "../common/main";
import { Divider, Spinner } from "@fluentui/react-components";
import { Sentence } from "./Sentence";

export const Proofreading: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [sentences, setSentences] = React.useState<Array<SlideText>>([]);
  const slideCounter: Set<string> = new Set<string>();

  useEffect(() => {
    const fetchSentences = async () => {
      const textData: Array<SlideText> = await getTextsFromSlides();
      const sentences: Array<SlideText> = await splitSentences(textData);

      setSentences(sentences);
      setLoading(false);
    };
    fetchSentences();
  }, []);

  let temp: Array<JSX.Element> = [];
  sentences.forEach((sentence: SlideText, index) => {
    if (!slideCounter.has(sentence.slideId)) {
      slideCounter.add(sentence.slideId);
      temp = [...temp, <Divider key={-(index + 1)}>슬라이드 {slideCounter.size}</Divider>];
    }
    temp = [...temp, <Sentence key={index} slideText={sentence} />];
  });

  return loading ? <Spinner label="문장 불러오는중..." labelPosition="below" size="huge" /> : <div>{temp}</div>;
};

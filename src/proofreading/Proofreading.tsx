import React, { useEffect } from "react";
import { getTextsFromSlides } from "../common";
import axios from "axios";
import Sentence from "./Sentence";
import { SlideText } from "../common/main";
import { Divider, Spinner } from "@fluentui/react-components";

const Proofreading: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [sentences, setSentences] = React.useState<Array<SlideText>>([]);
  const slideCounter: Set<string> = new Set<string>();

  useEffect(() => {
    const fetchSentences = async () => {
      const textData: Array<SlideText> = await getTextsFromSlides();

      let splittedSentences: Array<SlideText> = [];

      // TODO: poor performance, need improvement
      for (const textDatum of textData) {
        const splits: Array<string> = await splitSentences([textDatum.text]);
        splits.forEach((split) => {
          splittedSentences = [
            ...splittedSentences,
            { text: split, slideId: textDatum.slideId, slideIndex: textDatum.slideIndex },
          ];
        });
      }
      setSentences(splittedSentences);
      setLoading(false);
    };
    fetchSentences();
  }, []);

  const splitSentences = async (sentences: Array<string>): Promise<Array<string>> => {
    const { data } = await axios({
      method: "POST",
      url: "https://gd35659rx1.execute-api.ap-northeast-2.amazonaws.com/default/SentenceSplitter",
      data: { sentences },
    });
    return data.sentences;
  };

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

export default Proofreading;

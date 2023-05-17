import React, { useEffect } from "react";
import { getTextsFromSlides } from "../common";
import axios from "axios";
import Sentence from "./Sentence";
import { SlideText } from "../common/main";
import { Divider } from "@fluentui/react-components";

const Proofreading: React.FC = () => {
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
          splittedSentences = [...splittedSentences, { text: split, slideId: textDatum.slideId }];
        });
      }
      setSentences(splittedSentences);
    };
    fetchSentences();
  }, []);

  const splitSentences = async (sentences: Array<string>): Promise<Array<string>> => {
    const { data } = await axios({
      method: "POST",
      url: "https://gd35659rx1.execute-api.ap-northeast-2.amazonaws.com/default/SentenceSplitter",
      data: { sentences },
    });
    return data.body.sentences;
  };

  let temp: Array<JSX.Element> = [];
  sentences.forEach((sentence: SlideText, index) => {
    if (!slideCounter.has(sentence.slideId)) {
      slideCounter.add(sentence.slideId);
      temp = [
        ...temp,
        <Divider appearance="brand" key={-(index + 1)}>
          슬라이드 {slideCounter.size}
        </Divider>,
      ];
    }
    temp = [...temp, <Sentence key={index} sentence={sentence.text} />];
  });

  return <div>{temp}</div>;
};

export default Proofreading;

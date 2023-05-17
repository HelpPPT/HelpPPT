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

      // poor performance
      for (const textDatum of textData) {
        console.log(textDatum);
        const splits: Array<string> = await splitSentences([textDatum.text]);
        console.log(splits);
        splits.forEach((split) => {
          splittedSentences = [...splittedSentences, { text: split, slideId: textDatum.slideId }];
        });
      }

      console.log(splittedSentences);

      setSentences(splittedSentences);
    };
    fetchSentences();
  }, []);

  const splitSentences = async (slideTexts: Array<string>): Promise<Array<string>> => {
    const res: Response = await fetch(
      "https://hq8qv8fijj.execute-api.ap-northeast-2.amazonaws.com/default/SentenceSplitter",
      {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          sentences: slideTexts,
        }),
      }
    );
    const { sentences } = await res.json();

    console.log(sentences);

    return sentences;
  };

  let temp: Array<JSX.Element> = [];
  sentences.forEach((sentence: SlideText, index) => {
    if (!slideCounter.has(sentence.slideId)) {
      slideCounter.add(sentence.slideId);
      temp = [...temp, <Divider key={index * 1000 + 10000}>슬라이드 {slideCounter.size}</Divider>];
    }
    temp = [...temp, <Sentence key={index} sentence={sentence.text} />];
  });
  console.log(temp);

  return <div>{temp}</div>;
};

export default Proofreading;

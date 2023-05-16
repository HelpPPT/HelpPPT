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
      const textDatas: Array<SlideText> = await getTextsFromSlides();

      console.log(textDatas);

      // splitSentences need to be done.

      setSentences(textDatas);
    };
    fetchSentences();
  }, []);

  const splitSentences = async (sentences: Array<string>): Promise<Array<string>> => {
    const { data } = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/sentence-split",
      data: { sentences },
    });

    return data.sentences;
  };

  let temp: Array<JSX.Element> = [];
  sentences.forEach((sentence: SlideText, index) => {
    if (!slideCounter.has(sentence.slideId)) {
      slideCounter.add(sentence.slideId);
      temp = [...temp, <Divider key={index * 1000}>슬라이드 {slideCounter.size}</Divider>];
    }
    temp = [...temp, <Sentence key={index} sentence={sentence.text} />];
  });

  return <div>{temp}</div>;
};

export default Proofreading;

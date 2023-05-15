import React from "react";
import { Button } from "@fluentui/react-components";
import { getTextsFromSlides, SlideText } from "../common";
import axios from "axios";
import Sentence from "./Sentence";

const Proofreading: React.FC = () => {
  const dododo = async () => {
    const textDatas: Array<SlideText> = await getTextsFromSlides();
    const texts: Array<string> = textDatas.map((textData) => textData.text);

    const sentences = await splitSentences(texts);
    console.log(sentences);
  };

  const splitSentences = async (sentences: Array<string>): Promise<Array<string>> => {
    const { data } = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/sentence-split",
      data: { sentences },
    });

    return data.sentences;
  };

  const exampleTexts: Array<SlideText> = [
    {
      slideId: "0",
      text: "This is a sentence. This is another sentence.",
    },
    {
      slideId: "0",
      text: "This is a sentence. This is another sentence.",
    },
    {
      slideId: "1",
      text: "트리(Tree)의 개념 트리는 노드로 이루어진 자료구조로 스택이나 큐와 같은 선형 구조가 아닌 비선형 자료구조이다.",
    },
    {
      slideId: "1",
      text: "트리는 계층적 관계를 표현하는 자료구조이다.",
    },
    {
      slideId: "2",
      text: "오늘은 집에 몇 시에 갈 수 있을까?",
    },
  ];

  return (
    <div>
      {exampleTexts.map((exampleText, index) => (
        <Sentence key={index} slideText={exampleText} />
      ))}
    </div>
  );
};

export default Proofreading;

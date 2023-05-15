import React from "react";
import { Button } from "@fluentui/react-components";
import { getTextsFromSlides, SlideText } from "../common";
import axios from "axios";

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

  return (
    <Button appearance="primary" onClick={dododo}>
      Example
    </Button>
  );
};

export default Proofreading;

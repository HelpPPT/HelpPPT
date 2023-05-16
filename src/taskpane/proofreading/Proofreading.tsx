import React, { useEffect } from "react";
import { getTextsFromSlides, SlideText } from "../common";
import axios from "axios";
import Sentence from "./Sentence";

const Proofreading: React.FC = () => {
  const [sentences, setSentences] = React.useState<Array<string>>([]);

  useEffect(() => {
    const fetchSentences = async () => {
      const textDatas: Array<SlideText> = await getTextsFromSlides();
      const texts: Array<string> = textDatas.map((textData) => textData.text);
      const redundancyRemovedTexts: Array<string> = Array.from(new Set(texts));

      const sentences = await splitSentences(redundancyRemovedTexts);
      setSentences(sentences);
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

  return (
    <div>
      {sentences.map((exampleText, index) => (
        <Sentence key={index} sentence={exampleText} />
      ))}
    </div>
  );
};

export default Proofreading;

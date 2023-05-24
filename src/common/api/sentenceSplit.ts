import axios from "axios";
import { SlideText } from "../main";

export const splitSentences = async (slideTexts: Array<SlideText>): Promise<Array<SlideText>> => {
  const { data } = await axios({
    method: "POST",
    url: "https://gd35659rx1.execute-api.ap-northeast-2.amazonaws.com/default/SentenceSplitter",
    data: { slideTexts },
  });
  return data.slideTexts;
};

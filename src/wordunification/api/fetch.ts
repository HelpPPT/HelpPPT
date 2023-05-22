import axios from "axios";

export const splitSentences = async (sentences: Array<string>): Promise<Array<string>> => {
  const { data } = await axios({
    method: "POST",
    url: "https://gd35659rx1.execute-api.ap-northeast-2.amazonaws.com/default/SentenceSplitter",
    data: { sentences },
  });
  return data.sentences;
};

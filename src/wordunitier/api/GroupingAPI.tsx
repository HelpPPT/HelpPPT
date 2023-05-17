import axios from "axios";

export const getWordClusters = async (sentence: string): Promise<Array<Array<string>>> => {
  const { data } = await axios({
    method: "POST",
    // url: "https://8v8pkkotrh.execute-api.ap-northeast-2.amazonaws.com/grouping",
    url: "http://localhost:8000/grouping/",
    data: { sentence },
  });

  return data;
};

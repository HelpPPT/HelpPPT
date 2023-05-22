import axios from "axios";

export const getWordClusters = async (sentence_list: Array<string>): Promise<Array<Array<string>>> => {
  console.log(sentence_list);

  const { data } = await axios({
    method: "POST",
    url: "https://9am0wggk5f.execute-api.ap-northeast-2.amazonaws.com/default",
    headers: { "Content-Type": "application/json" },
    data: sentence_list,
  });

  return data;
};

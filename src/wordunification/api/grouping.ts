import axios from "axios";

export const getWordClusters = async (
  sentence_list: Array<string>,
  is_filter = false,
  glossary_name = null
): Promise<Array<Array<string>>> => {
  const { data } = await axios({
    method: "POST",
    url: "https://9am0wggk5f.execute-api.ap-northeast-2.amazonaws.com/default",
    headers: { "Content-Type": "application/json" },
    data: { sentence_list, is_filter, glossary_name },
  });

  return data;
};

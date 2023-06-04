import axios from "axios";

export const translate = async (text: string, lang: string): Promise<string> => {
  const translatedWord: string = await __translate(text, lang);
  const titleCaseText: string = translatedWord
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return titleCaseText;
};

const __translate = async (text: string, lang: string): Promise<string> => {
  const { data } = await axios({
    method: "GET",
    url: `https://mix79ljpyh.execute-api.ap-northeast-2.amazonaws.com/default/googleTranslationV2?text=${text}&lang=${lang}`,
  });
  return data;
};

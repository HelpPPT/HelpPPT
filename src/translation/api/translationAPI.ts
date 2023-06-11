import axios from "axios";

export enum Translator {
  Google = "google",
  Papago = "papago",
}

export const translate = async (text: string, lang: string, translator: Translator): Promise<string> => {
  const translatedWord: string = await __translate(text, lang, translator);
  const titleCaseText: string = translatedWord
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return titleCaseText;
};

const __translate = async (text: string, lang: string, translator: Translator): Promise<string> => {
  const API_URL: string =
    translator === Translator.Google
      ? "https://mix79ljpyh.execute-api.ap-northeast-2.amazonaws.com/default/googleTranslationV2"
      : "https://p1faduw6hl.execute-api.ap-northeast-2.amazonaws.com/default/papagoTranslate";

  const { data } = await axios({
    method: "GET",
    url: `${API_URL}?text=${text}&lang=${lang}`,
  });
  return data;
};

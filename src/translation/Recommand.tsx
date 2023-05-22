import * as React from "react";
import { Switch } from "@fluentui/react-components";
import { useSetInterval } from "@fluentui/react-hooks";
import axios from "axios";

export const Recommand: React.FunctionComponent = () => {
  const [isChecked, setChecked] = React.useState<boolean>(false);
  const [intervalId, setIntervalId] = React.useState<number | null>(null);

  const { setInterval, clearInterval } = useSetInterval();

  const changeToggle = () => {
    const nextChecked: boolean = !isChecked;

    if (nextChecked) {
      setRecommandationON();
    } else {
      setRecommandationOFF();
    }

    setChecked(nextChecked);
  };

  const setRecommandationON = () => {
    setIntervalId(setInterval(recommandWord, 1000));
  };
  const setRecommandationOFF = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  const recommandWord = async () => {
    const currentSelectedWord: string = await getSelectedText();

    if (currentSelectedWord && currentSelectedWord.endsWith("()")) {
      _recommandWord(currentSelectedWord);
    } else if (currentSelectedWord && currentSelectedWord.endsWith("[]")) {
      recommandByDragSelection();
    }
  };

  const _recommandWord = async (currentSelectedWord: string) => {
    await setSelectedText(currentSelectedWord.replace(/.{0,2}$/, ""));

    const originalSelectedWord: string = await getSelectedText();
    if (!originalSelectedWord) {
      return;
    }

    const recommandWord: string = await getRecommandWord(originalSelectedWord);

    await setSelectedText(`${originalSelectedWord}(${recommandWord})`);
  };

  const recommandByDragSelection = async () => {
    Office.context.document.getSelectedDataAsync<string>(Office.CoercionType.Text, (result) => {
      if (result.status !== Office.AsyncResultStatus.Succeeded) {
        return;
      }

      const selectedText: string = result.value.trim();
      if (!(selectedText && selectedText.endsWith("[]"))) {
        return;
      }

      _recommandWord(selectedText);
    });
  };

  const getSelectedText = async (): Promise<string> =>
    PowerPoint.run(async (context: PowerPoint.RequestContext) => {
      const textRange = context.presentation.getSelectedTextRange();
      try {
        await context.sync();
      } catch (error) {
        return "";
      }

      textRange.load("text");
      await context.sync();
      return textRange.text.trim();
    });

  const setSelectedText = async (value: any) =>
    PowerPoint.run(async (context: PowerPoint.RequestContext) => {
      const textRange = context.presentation.getSelectedTextRange();
      try {
        await context.sync();
      } catch (error) {
        return;
      }

      textRange.load("text");
      await context.sync();
      textRange.text = value;
    });

  const getRecommandWord = async (originalSelectedWord: string): Promise<string> => {
    const translatedOriginalSelectedWord: string = await translateToEng(originalSelectedWord);
    const recommandWord: string = translatedOriginalSelectedWord
      .replace(/[.]*$/, "")
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
    return recommandWord;
  };

  const translateToEng = async (text: string): Promise<string> => {
    const { data } = await axios({
      method: "GET",
      url: `https://mix79ljpyh.execute-api.ap-northeast-2.amazonaws.com/default/googleTranslationV2?text=${text}`,
    });
    return data;
  };

  return <Switch checked={isChecked} label={isChecked ? "ON" : "OFF"} onClick={changeToggle} />;
};

import * as React from "react";
import { Toggle } from "@fluentui/react/lib/Toggle";
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
    setIntervalId(setInterval(recommandWord, 5000));
  };
  const setRecommandationOFF = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  const recommandWord = async () => {
    const currentSelectedWord: string = await getSelectedText();
    if (!(currentSelectedWord && currentSelectedWord.endsWith("()"))) {
      return;
    }

    await setSelectedText(currentSelectedWord.replace(/.{0,2}$/, ""));

    const originalSelectedWord: string = await getSelectedText();
    if (!originalSelectedWord) {
      return;
    }

    const translatedOriginalSelectedWord: string = await translateToEng(originalSelectedWord);
    const processedWord: string = translatedOriginalSelectedWord
      .replace(/[.]*$/, "")
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");

    await setSelectedText(`${originalSelectedWord}(${processedWord})`);
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

  const translateToEng = async (text: string): Promise<string> => {
    const { data } = await axios({
      method: "get",
      url: `http://localhost:5000/?text=${text}`,
    });
    return data;
  };

  return (
    <div>
      <Toggle label="자동완성" onText="On" offText="Off" checked={isChecked} onChange={changeToggle} />
    </div>
  );
};

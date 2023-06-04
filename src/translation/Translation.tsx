import * as React from "react";
import { Switch } from "@fluentui/react-components";
import { useSetInterval } from "@fluentui/react-hooks";
import Option from "./Options";
import { getSelectedTextRange, setSelectedTextRangeText } from "../common";
import { translate } from "./api/translationAPI";

type TranslationProps = {
  active: boolean;
};

type TranslationOption = {
  isTranslationON: boolean;
  wordBaseTranslationSuffix: TranslationSuffix;
  selectBaseTranslationSuffix: TranslationSuffix;
  targetLanguage: TargetLanguage;
};

enum TranslationSuffix {
  "( )" = "()",
  "[ ]" = "[]",
  "{ }" = "{}",
}

enum TargetLanguage {
  "한국어" = "ko",
  "영어" = "en",
  "일본어" = "ja",
  "중국어" = "zh",
}

const Translation: React.FunctionComponent<TranslationProps> = ({ active }: TranslationProps) => {
  const [options, setOptions] = React.useState<TranslationOption>({
    isTranslationON: false,
    wordBaseTranslationSuffix: TranslationSuffix["( )"],
    selectBaseTranslationSuffix: TranslationSuffix["[ ]"],
    targetLanguage: TargetLanguage["한국어"],
  });
  const [intervalId, setIntervalId] = React.useState<number | null>(null);

  const { setInterval, clearInterval } = useSetInterval();

  const optionHandler = (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    setOptions({ ...options, [target.name]: target.value });
  };

  const toggleHandler = (event: React.MouseEvent<HTMLInputElement>) => {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    target.checked ? setTranslationON() : setTranslationOFF();
  };

  const setTranslationON = () => {
    setIntervalId(setInterval(translatedWord, 1000));
    setOptions({ ...options, isTranslationON: true });
  };
  const setTranslationOFF = () => {
    clearInterval(intervalId);
    setIntervalId(null);
    setOptions({ ...options, isTranslationON: false });
  };

  const translatedWord = async () => {
    const currentSelectedWordTextRange: PowerPoint.TextRange = await getSelectedTextRange();
    const currentSelectedWord: string = currentSelectedWordTextRange.text;

    if (currentSelectedWord && currentSelectedWord.endsWith(options.wordBaseTranslationSuffix)) {
      const originalWordTextRange: PowerPoint.TextRange = await getOriginalWord();
      const originalWord: string = originalWordTextRange.text;
      const translatedWord = await translate(originalWord, options.targetLanguage);
      await setSelectedTextRangeText(`${originalWord}(${translatedWord})`);
    } else if (currentSelectedWord && currentSelectedWord.endsWith(options.selectBaseTranslationSuffix)) {
      Office.context.document.getSelectedDataAsync<string>(Office.CoercionType.Text, async (result) => {
        if (result.status !== Office.AsyncResultStatus.Succeeded) return;

        const selectedText: string = result.value.trim();
        if (!(selectedText && selectedText.endsWith(options.selectBaseTranslationSuffix))) {
          return;
        }

        const originalWord: string = selectedText.substring(
          0,
          selectedText.length - options.selectBaseTranslationSuffix.length
        );
        const translatedWord = await translate(originalWord, options.targetLanguage);
        await setSelectedTextRangeText(`${originalWord}(${translatedWord})`);
      });
    }
  };

  const getOriginalWord = async (): Promise<PowerPoint.TextRange> => {
    await setSelectedTextRangeText("");
    return await getSelectedTextRange();
  };

  return (
    <div style={active ? null : { display: "none" }}>
      <div>
        <Switch name="isTranslationON" onClick={toggleHandler} />
      </div>
      <Option
        name="wordBaseTranslationSuffix"
        optionEnum={TranslationSuffix}
        options={options}
        optionHandler={optionHandler}
      />
      <Option
        name="selectBaseTranslationSuffix"
        optionEnum={TranslationSuffix}
        options={options}
        optionHandler={optionHandler}
      />
      <Option name="targetLanguage" optionEnum={TargetLanguage} options={options} optionHandler={optionHandler} />
    </div>
  );
};

export default Translation;

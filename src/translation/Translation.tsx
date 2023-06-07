import * as React from "react";
import { makeStyles, shorthands, Switch } from "@fluentui/react-components";
import { useSetInterval } from "@fluentui/react-hooks";
import Option from "./Options";
import { getSelectedTextRange, setSelectedTextRangeText } from "../common";
import { translate, Translator } from "./api/translationAPI";
import {
  DeveloperBoardSearch24Regular,
  LocalLanguage24Regular,
  PanelRightCursor24Regular,
  SelectObjectSkewEdit24Regular,
  TranslateAuto24Filled,
  TranslateOff24Regular,
} from "@fluentui/react-icons";

type TranslationProps = {
  active: boolean;
};

type TranslationOption = {
  isTranslationON: boolean;
  wordBaseTranslationSuffix: TranslationSuffix;
  selectBaseTranslationSuffix: TranslationSuffix;
  targetLanguage: TargetLanguage;
  translator: Translator;
};

enum TranslationSuffix {
  "( )" = "()",
  "[ ]" = "[]",
  "{ }" = "{}",
  "< >" = "<>",
}

enum TargetLanguage {
  "한국어" = "ko",
  "영어" = "en",
  "일본어" = "ja",
  "중국어" = "zh",
}

const useStyles = makeStyles({
  onOffButton: {
    ...shorthands.padding("0.5rem", "0.7rem", 0),
  },
  title: {
    marginTop: "1rem",
    ...shorthands.padding("0.5rem", "0.5rem"),
  },
});

const Translation: React.FunctionComponent<TranslationProps> = ({ active }: TranslationProps) => {
  const styles = useStyles();

  const [options, setOptions] = React.useState<TranslationOption>({
    isTranslationON: false,
    wordBaseTranslationSuffix: TranslationSuffix["( )"],
    selectBaseTranslationSuffix: TranslationSuffix["[ ]"],
    targetLanguage: TargetLanguage["영어"],
    translator: Translator.Google,
  });
  const [intervalId, setIntervalId] = React.useState<number | null>(null);

  const { setInterval, clearInterval } = useSetInterval();

  React.useEffect(() => {
    if (options.isTranslationON) {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }

      const newIntervalId = setInterval(translatedWord, 1000);
      setIntervalId(newIntervalId);
    }
  }, [options]);

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
      const translatedWord = await translate(originalWord, options.targetLanguage, options.translator);
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
        const translatedWord = await translate(originalWord, options.targetLanguage, options.translator);
        await setSelectedTextRangeText(`${originalWord}(${translatedWord})`);
      });
    }
  };

  const getOriginalWord = async (): Promise<PowerPoint.TextRange> => {
    await setSelectedTextRangeText("");
    return await getSelectedTextRange();
  };

  return (
    <div style={active ? { display: "flex", flexDirection: "column" } : { display: "none" }}>
      <div className={styles.onOffButton}>
        {options.isTranslationON ? <TranslateAuto24Filled /> : <TranslateOff24Regular />}
        <Switch
          name="isTranslationON"
          checked={options.isTranslationON}
          label={options.isTranslationON ? "ON" : "OFF"}
          onClick={toggleHandler}
        />
      </div>
      <Option
        title="번역기"
        icon={<DeveloperBoardSearch24Regular />}
        name="translator"
        optionEnum={Translator}
        options={options}
        optionHandler={optionHandler}
      />
      <Option
        title="자동완성 언어"
        icon={<LocalLanguage24Regular />}
        name="targetLanguage"
        optionEnum={TargetLanguage}
        options={options}
        optionHandler={optionHandler}
      />
      <Option
        title="커서 기반 자동완성 명령어"
        icon={<PanelRightCursor24Regular />}
        name="wordBaseTranslationSuffix"
        optionEnum={TranslationSuffix}
        options={options}
        optionHandler={optionHandler}
      />
      <Option
        title="선택 기반 자동완성 명령어"
        icon={<SelectObjectSkewEdit24Regular />}
        name="selectBaseTranslationSuffix"
        optionEnum={TranslationSuffix}
        options={options}
        optionHandler={optionHandler}
      />
    </div>
  );
};

export default Translation;

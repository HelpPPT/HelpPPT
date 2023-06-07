import { makeStyles, mergeClasses, shorthands, tokens } from "@fluentui/react-components";
import { SlideText } from "../common/main";

export type SentenceValidationResult = {
  isValid: boolean;
  invalidDatas: Array<ValidatorData>;
};

type ValidatorData = {
  validatorFunc: (slideText: SlideText) => boolean;
  badgeStyle: string;
  message: string;
};

const useStyles = makeStyles({
  badge: {
    backgroundColor: tokens.colorBrandForeground1,
    ...shorthands.margin(0, "8px", 0, "4px"),
  },
  redBadge: {
    backgroundColor: tokens.colorPaletteRedForeground1,
  },
  greenBadge: {
    backgroundColor: tokens.colorPaletteGreenForeground1,
  },
  orangeBadge: {
    backgroundColor: tokens.colorPaletteDarkOrangeForeground1,
  },
  yellowBadge: {
    backgroundColor: tokens.colorPaletteYellowBorderActive,
  },
  berryBadge: {
    backgroundColor: tokens.colorPaletteBerryForeground1,
  },
  marigoldBadge: {
    backgroundColor: tokens.colorPaletteMarigoldForeground1,
  },
  blueBadge: {
    backgroundColor: tokens.colorPaletteBlueForeground2,
  },
});

export const validateSentence = (slideText: SlideText): SentenceValidationResult => {
  const styles = useStyles();

  const textValidatorsData: Array<ValidatorData> = [
    {
      validatorFunc: validateLengthLimit,
      badgeStyle: mergeClasses(styles.badge, styles.redBadge),
      message: "한 줄이 너무 길어요.",
    },
  ];

  const sentenceValidatorsData: Array<ValidatorData> = [
    {
      validatorFunc: validateLengthLimit,
      badgeStyle: mergeClasses(styles.badge, styles.redBadge),
      message: "문장이 너무 길어요.",
    },
    {
      validatorFunc: validatePunctuationSpacing,
      badgeStyle: mergeClasses(styles.badge, styles.orangeBadge),
      message: "구두점 뒤에는 띄어쓰기를 해주세요.",
    },
    {
      validatorFunc: validateNoConsecutiveSpaces,
      badgeStyle: mergeClasses(styles.badge, styles.berryBadge),
      message: "띄어쓰기가 연속되었어요.",
    },
    {
      validatorFunc: validateNoDoubleNegatives,
      badgeStyle: mergeClasses(styles.badge, styles.blueBadge),
      message: "'안'이나 '않'이 연속되었어요.",
    },
    {
      validatorFunc: validateClosingBrackets,
      badgeStyle: mergeClasses(styles.badge, styles.blueBadge),
      message: "괄호가 감싸지지 않았어요.",
    },
    {
      validatorFunc: validateMissingQuotationMarksBeforeRago,
      badgeStyle: mergeClasses(styles.badge, styles.blueBadge),
      message: '라고 앞에 " 가 없어요.',
    },
    {
      validatorFunc: validateMissingClosedQuotationMarks,
      badgeStyle: mergeClasses(styles.badge, styles.blueBadge),
      message: '" 로 완전히 둘러쌓이지 않았어요.',
    },
    {
      validatorFunc: validateFirstCharacterCapitalLetter,
      badgeStyle: mergeClasses(styles.badge, styles.blueBadge),
      message: "문장의 처음은 대문자로 시작해야 해요.",
    },
  ];

  const validatorsData: Array<ValidatorData> = slideText?.isSentence ? sentenceValidatorsData : textValidatorsData;
  const validationResult: SentenceValidationResult = validatorsData.reduce(
    (acc: SentenceValidationResult, validatorData: ValidatorData) => {
      const isValid = validatorData.validatorFunc(slideText);

      if (!isValid) {
        acc.isValid = false;
        acc.invalidDatas.push(validatorData);
      }
      return acc;
    },
    { isValid: true, invalidDatas: [] } as SentenceValidationResult
  );

  return validationResult;
};

const validateLengthLimit = (slideText: SlideText, limit: number = 100): boolean => {
  const text: string = slideText.text;
  return text.length <= limit;
};

const validatePunctuationSpacing = (slideText: SlideText): boolean => {
  const text: string = slideText.text;
  if (!/\s*[,;?!]\s*/.test(text)) return true;
  else if (/[,;?!]/.test(text[text.length - 1])) return true;
  else if (/\b\d+[.,]\d+\b/.test(text)) return true;
  else return /[,;?!]\s+/.test(text);
};

const validateNoConsecutiveSpaces = (slideText: SlideText): boolean => {
  const text: string = slideText.text;
  let consecutive_spaces_cnt = 0;
  let cnt = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] == " ") cnt++;
    else {
      consecutive_spaces_cnt = consecutive_spaces_cnt > cnt ? consecutive_spaces_cnt : cnt;
      cnt = 0;
    }
  }
  if (consecutive_spaces_cnt >= 3 && consecutive_spaces_cnt <= 5) return false;
  else return true;
};

const validateClosingBrackets = (slideText: SlideText): boolean => {
  const text: string = slideText.text;
  if (/[가-힣a-zA-Z0-9]\)/.test(text)) return true;
  let open = 0,
    closed = 0;
  for (let c of text) {
    if (c == "(") open++;
    else if (c == ")") closed++;
  }

  return open === closed;
};

const validateMissingQuotationMarksBeforeRago = (slideText: SlideText): boolean => {
  const text: string = slideText.text;
  // 라고 앞에 처음 나오는 단어(space) 제외하고 " 가 있어야 한다.
  if (!/(라고)/.test(text)) return true;
  else return /["”]\s*라고/.test(text);
};

const validateMissingClosedQuotationMarks = (slideText: SlideText): boolean => {
  const text: string = slideText.text;
  let open = 0,
    closed = 0;
  for (let c of text) {
    if (c == '"' || c == "“") open++;
    else if (c == '"' || c == "”") closed++;
  }

  return open === closed;
};

const validateNoDoubleNegatives = (slideText: SlideText): boolean => {
  const text: string = slideText.text;
  return !/안\s*[^ ]*\s*않았다/.test(text);
};

const validateFirstCharacterCapitalLetter = (slideText: SlideText): boolean => {
  const text: string = slideText.text;
  return !/^[a-z]/.test(text);
};

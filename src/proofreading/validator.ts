import { mergeClasses } from "@fluentui/react-components";
import { SlideText } from "../common/main";
import { getTextFont } from "./common/slide";

export type SentenceValidationResult = {
  isValid: boolean;
  invalidDatas: Array<ValidatorData>;
};

type ValidatorData = {
  validatorFunc: (slideText: SlideText) => Promise<boolean>;
  badgeStyle: string;
  message: string;
};

export const validateSentence = async (
  slideText: SlideText,
  badgeStyles: any,
  gejosikData: Object
): Promise<SentenceValidationResult> => {
  const textValidatorsData: Array<ValidatorData> = [
    {
      validatorFunc: validateLengthLimit,
      badgeStyle: mergeClasses(badgeStyles.badge, badgeStyles.redBadge),
      message: "한 줄이 너무 길어요.",
    },
  ];

  const sentenceValidatorsData: Array<ValidatorData> = [
    {
      validatorFunc: validateLengthLimit,
      badgeStyle: mergeClasses(badgeStyles.badge, badgeStyles.redBadge),
      message: "문장이 너무 길어요.",
    },
    {
      validatorFunc: validatePunctuationSpacing,
      badgeStyle: mergeClasses(badgeStyles.badge, badgeStyles.greenBadge),
      message: "구두점 뒤에는 띄어쓰기를 해주세요.",
    },
    {
      validatorFunc: validateNoConsecutiveSpaces,
      badgeStyle: mergeClasses(badgeStyles.badge, badgeStyles.orangeBadge),
      message: "띄어쓰기가 연속되었어요.",
    },
    {
      validatorFunc: validateNoDoubleNegatives,
      badgeStyle: mergeClasses(badgeStyles.badge, badgeStyles.yellowBadge),
      message: "'안'이나 '않'이 연속되었어요.",
    },
    {
      validatorFunc: validateClosingBrackets,
      badgeStyle: mergeClasses(badgeStyles.badge, badgeStyles.berryBadge),
      message: "괄호가 감싸지지 않았어요.",
    },
    {
      validatorFunc: validateMissingQuotationMarksBeforeRago,
      badgeStyle: mergeClasses(badgeStyles.badge, badgeStyles.marigoldBadge),
      message: '라고 앞에 " 가 없어요.',
    },
    {
      validatorFunc: validateMissingClosedQuotationMarks,
      badgeStyle: mergeClasses(badgeStyles.badge, badgeStyles.orangeBadge),
      message: '" 로 완전히 둘러쌓이지 않았어요.',
    },
    // {
    //   validatorFunc: validateFirstCharacterCapitalLetter,
    //   badgeStyle: mergeClasses(badgeStyles.badge, badgeStyles.yellowBadge),
    //   message: "문장의 처음은 대문자로 시작해야 해요.",
    // },
    // {
    //   validatorFunc: validateInconsistentFontSize,
    //   badgeStyle: mergeClasses(badgeStyles.badge, badgeStyles.berryBadge),
    //   message: "폰트 사이즈가 일정하지 않아요.",
    // },
    {
      validatorFunc: validateTooSmallFontSize,
      badgeStyle: mergeClasses(badgeStyles.badge, badgeStyles.blueBadge),
      message: "글씨가 너무 작아요.",
    },
    {
      validatorFunc: async (slideText: SlideText) =>
        !(slideText.text in gejosikData) || gejosikData[slideText.text].trim() === slideText.text.trim(),
      badgeStyle: mergeClasses(badgeStyles.badge, badgeStyles.redBadge),
      message: "문장이 개조식이면 더 좋아요.",
    },
  ];

  const validatorsData: Array<ValidatorData> = slideText?.isSentence ? sentenceValidatorsData : textValidatorsData;
  const validationResult: SentenceValidationResult = { isValid: true, invalidDatas: [] };

  for (let index = 0; index < validatorsData.length; index++) {
    const validatorData: ValidatorData = validatorsData[index];
    const isValid = await validatorData.validatorFunc(slideText);
    if (!isValid) {
      validationResult.isValid = false;
      validationResult.invalidDatas.push(validatorData);
    }
  }

  return validationResult;
};

const validateLengthLimit = async (slideText: SlideText, limit: number = 100): Promise<boolean> => {
  const text: string = slideText.text;
  return text.length <= limit;
};

const validatePunctuationSpacing = async (slideText: SlideText): Promise<boolean> => {
  const text: string = slideText.text;
  if (!/\s*[,;?!]\s*/.test(text)) return true;
  else if (/[,;?!]/.test(text[text.length - 1])) return true;
  else if (/\b\d+[.,]\d+\b/.test(text)) return true;
  else return /[,;?!]\s+/.test(text);
};

const validateNoConsecutiveSpaces = async (slideText: SlideText): Promise<boolean> => {
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

const validateClosingBrackets = async (slideText: SlideText): Promise<boolean> => {
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

const validateMissingQuotationMarksBeforeRago = async (slideText: SlideText): Promise<boolean> => {
  const text: string = slideText.text;
  // 라고 앞에 처음 나오는 단어(space) 제외하고 " 가 있어야 한다.
  if (!/(라고)/.test(text)) return true;
  else return /["”]\s*라고/.test(text);
};

const validateMissingClosedQuotationMarks = async (slideText: SlideText): Promise<boolean> => {
  const text: string = slideText.text;
  let open = 0,
    closed = 0;
  for (let c of text) {
    if (c == '"' || c == "“") open++;
    else if (c == '"' || c == "”") closed++;
  }

  return open === closed;
};

const validateNoDoubleNegatives = async (slideText: SlideText): Promise<boolean> => {
  const text: string = slideText.text;
  return !/안\s*[^ ]*\s*않았다/.test(text);
};

// const validateFirstCharacterCapitalLetter = async (slideText: SlideText): Promise<boolean> => {
//   const text: string = slideText.text;
//   return !/^[a-z]/.test(text);
// };

const validateInconsistentFontSize = async (slideText: SlideText): Promise<boolean> => {
  const font: PowerPoint.ShapeFont = await getTextFont(slideText);
  return font.size !== 0;
};

const validateTooSmallFontSize = async (slideText: SlideText): Promise<boolean> => {
  const font: PowerPoint.ShapeFont = await getTextFont(slideText);
  return font.size >= 16 || font.size === 0;
};

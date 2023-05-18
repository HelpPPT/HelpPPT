import { makeStyles, mergeClasses, shorthands, tokens } from "@fluentui/react-components";
import { SlideText } from "../common/main";

export type SentenceValidationResult = {
  isValid: boolean;
  invalidDatas: Array<ValidatorData>;
};

type ValidatorData = {
  validatorFunc: Function;
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
    backgroundColor: tokens.colorPaletteYellowForeground1,
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

  const validatorsData: Array<ValidatorData> = [
    {
      validatorFunc: validateLengthLimit,
      badgeStyle: mergeClasses(styles.badge, styles.redBadge),
      message: "문장이 너무 길어요.",
    },
    {
      validatorFunc: validateEndWithPeriodOrQuestionOrExclamation,
      badgeStyle: mergeClasses(styles.badge, styles.greenBadge),
      message: "문장이 마침표, 물음표, 느낌표로 끝나지 않았어요.",
    },
    {
      validatorFunc: validateCommaSpacing,
      badgeStyle: mergeClasses(styles.badge, styles.orangeBadge),
      message: "쉼표 뒤에는 띄어쓰기를 해주세요.",
    },
    {
      validatorFunc: validateStartWithCapital,
      badgeStyle: mergeClasses(styles.badge, styles.yellowBadge),
      message: "문장이 대문자로 시작하지 않았어요.",
    },
    {
      validatorFunc: validateNoConsecutiveSpaces,
      badgeStyle: mergeClasses(styles.badge, styles.berryBadge),
      message: "띄어쓰기가 연속되었어요.",
    },
    {
      validatorFunc: validateSingleQuestionOrExclamation,
      badgeStyle: mergeClasses(styles.badge, styles.marigoldBadge),
      message: "물음표나 느낌표가 2개 이상 있어요.",
    },
    {
      validatorFunc: validateNoDoubleNegatives,
      badgeStyle: mergeClasses(styles.badge, styles.blueBadge),
      message: "'안'이나 '않'이 연속되었어요.",
    },
  ];

  const validationResult: SentenceValidationResult = validatorsData.reduce(
    (acc: SentenceValidationResult, validatorData: ValidatorData) => {
      const isValid = validatorData.validatorFunc(slideText.text);
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

const validateLengthLimit = (input: string, limit: number = 10): boolean => {
  return input.length <= limit;
};

const validateEndWithPeriodOrQuestionOrExclamation = (input: string): boolean => {
  return /.*[.|?|!]$/.test(input);
};

const validateCommaSpacing = (input: string): boolean => {
  return !/,[^ ]/.test(input);
};

const validateStartWithCapital = (input: string): boolean => {
  return /^[A-Z|가-힣]/.test(input);
};

const validateNoConsecutiveSpaces = (input: string): boolean => {
  return !/\s{2,}/.test(input);
};

const validateSingleQuestionOrExclamation = (input: string): boolean => {
  return (input.match(/\?|!/g) || []).length <= 1;
};

const validateNoDoubleNegatives = (input: string): boolean => {
  return !/안\s*[^ ]*\s*않았다/.test(input);
};

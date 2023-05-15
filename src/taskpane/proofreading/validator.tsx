import { SlideText } from "../common";

export type SentenceValidationResult = {
  isValid: boolean;
  messages: Array<string>;
};

type ValidatorData = {
  validatorFunc: Function;
  message: string;
};

export const validateSentence = (slideText: SlideText): SentenceValidationResult => {
  const validatorsData: Array<ValidatorData> = [
    {
      validatorFunc: validateLengthLimit,
      message: "문장이 너무 길어요.",
    },
    {
      validatorFunc: validateEndWithPeriodOrQuestionOrExclamation,
      message: "문장이 마침표, 물음표, 느낌표로 끝나지 않았어요.",
    },
    {
      validatorFunc: validateCommaSpacing,
      message: "쉼표 뒤에는 띄어쓰기를 해주세요.",
    },
    {
      validatorFunc: validateStartWithCapital,
      message: "문장이 대문자로 시작하지 않았어요.",
    },
    {
      validatorFunc: validateNoConsecutiveSpaces,
      message: "띄어쓰기가 연속되었어요.",
    },
    {
      validatorFunc: validateSingleQuestionOrExclamation,
      message: "물음표나 느낌표가 2개 이상 있어요.",
    },
    {
      validatorFunc: validateNoDoubleNegatives,
      message: "'안'이나 '않'이 연속되었어요.",
    },
  ];

  const validationResult: SentenceValidationResult = validatorsData.reduce(
    (acc: SentenceValidationResult, validatorData: ValidatorData) => {
      const isValid = validatorData.validatorFunc(slideText.text);
      if (!isValid) {
        acc.isValid = false;
        acc.messages.push(validatorData.message);
      }
      return acc;
    },
    { isValid: true, messages: [] } as SentenceValidationResult
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

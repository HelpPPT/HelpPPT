export const validateSentence = (input: string): boolean => {
  return;
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

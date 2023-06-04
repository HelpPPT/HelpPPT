import React from "react";
import { Divider } from "@fluentui/react-components";
import { Sentence } from "./Sentence";
import { validateSentence } from "./validator";
import { SlideTexts } from "../common/main";

type SlideValidationProps = {
  slideSentenceGroup: SlideTexts;
};

export const SlideValidation: React.FC<SlideValidationProps> = ({ slideSentenceGroup }: SlideValidationProps) => {
  const validatedSentenceGroup = slideSentenceGroup.texts.map((sentence, index) => {
    const validationResult = validateSentence(sentence);
    return validationResult.isValid ? null : (
      <Sentence key={index} slideText={sentence} validationResult={validationResult} />
    );
  });

  return validatedSentenceGroup.every((e) => e === null) ? null : (
    <>
      <Divider>슬라이드 {slideSentenceGroup.slideIndex}</Divider>
      {validatedSentenceGroup}
    </>
  );
};

import React from "react";
import { Button, ButtonProps } from "@fluentui/react-components";
import { getTextsFromSlides, Text } from "../common";

const Proofreading: React.FC = (props: ButtonProps) => {
  const splitSentences = async () => {
    const texts: Array<Text> = await getTextsFromSlides();
    console.log(texts);
  };

  return (
    <Button {...props} appearance="primary" onClick={splitSentences}>
      Example
    </Button>
  );
};

export default Proofreading;

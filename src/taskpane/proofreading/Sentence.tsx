import React from "react";
import { SlideText } from "../common";

type SentenceProps = {
  slideText: SlideText;
};

const Sentence: React.FC<SentenceProps> = ({ slideText }: SentenceProps) => {
  return (
    <div>
      {slideText.slideId} {slideText.text}
    </div>
  );
};

export default Sentence;

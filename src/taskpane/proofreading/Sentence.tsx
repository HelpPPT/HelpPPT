import React from "react";
import { SlideText } from "../common";

interface SentenceProps {
  slideText: SlideText;
}

const Sentence: React.FC<SentenceProps> = ({ slideText }: SentenceProps) => {
  return <div>Sentence {slideText}</div>;
};

export default Sentence;

import React from "react";
import { SlideText } from "../common";

interface SentenceProps {
  slidesTexts: Array<SlideText>;
}

export default function Sentence({ slidesTexts }: SentenceProps): React.ReactElement<SentenceProps> {
  return <div>Sentence</div>;
}

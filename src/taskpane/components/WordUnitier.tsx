/* eslint-disable react/jsx-key */
import * as React from "react";
import { Button } from "@fluentui/react-components";
import { getWordClusters } from "../../wordunitier/api/GroupingAPI";
import { ClusterList } from "../../wordunitier/components/ClusterList";

export const WordUnitier: React.FC = () => {
  const [wordClusters, setWordClusters] = React.useState<Array<Array<string>>>([]);

  React.useEffect(() => {
    <ClusterList wordClusters={wordClusters} />;
  }, [wordClusters]);

  const getTextsFromSlides = async (): Promise<Array<string>> =>
    await PowerPoint.run(async (context: PowerPoint.RequestContext) => {
      const textBuffer: Array<string> = [];

      const slides = context.presentation.slides;

      context.load(slides, "id,shapes/items/type");
      await context.sync();

      for (const slide of slides.items) {
        // console.log("Slide ID:", slide.id);

        for (const shape of slide.shapes.items) {
          if (shape.type === "Unsupported") {
            continue;
          }

          context.load(shape, "textFrame/hasText");
          await context.sync();

          if (!shape.textFrame.hasText) {
            continue;
          }

          context.load(shape, "textFrame/textRange/text");
          await context.sync();

          textBuffer.push(shape.textFrame.textRange.text.trim().replace(/[\n\r\v]/g, "\n"));

          // console.log("Text:", shape.textFrame.textRange.text.replace(/[\n\r\v]/g, "\n"));
        }
      }
      return textBuffer;
    });

  const showClusters = async () => {
    const fullSentence: string = (await getTextsFromSlides()).join("\n");
    const clusters: Array<Array<string>> = await getWordClusters(fullSentence);
    setWordClusters(clusters);
    // unitifyWord(wordClusters[0], wordClusters[0][0]);
  };

  return (
    <div style={{ marginTop: "1em", display: "flex", flexDirection: "column" }}>
      <Button appearance="primary" onClick={showClusters}>
        단어 통일
      </Button>
      <ClusterList wordClusters={wordClusters} />
    </div>
  );
};

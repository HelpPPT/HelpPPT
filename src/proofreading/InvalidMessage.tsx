import { Badge, Body1, Button, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { Edit16Filled } from "@fluentui/react-icons";
import React from "react";
import { SlideText } from "../common/main";
import { setFontSize } from "./common/slide";
import { convertToGejosik } from "./common/fetch";

const useStyles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
  },

  text: {
    ...shorthands.margin(0),
  },

  editButton: {
    color: tokens.colorCompoundBrandForeground1,
    ...shorthands.margin(0, 0, 0, "3px"),
  },
});

type InvalidMessageProps = {
  slideText: SlideText;
  badgeStyle: string;
  message: string;
  gejosikData: Object;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const InvalidMessage: React.FC<InvalidMessageProps> = ({
  slideText,
  badgeStyle,
  message,
  gejosikData,
  setLoading,
}: InvalidMessageProps) => {
  const styles = useStyles();

  const setFontSize24 = () => setTimeout(() => setFontSize(slideText, 24).then(() => setLoading(true)), 250);
  const unifyFontSize = () => setTimeout(() => setFontSize(slideText, -1).then(() => setLoading(true)), 250);
  const setSentenceToGejosik = () =>
    setTimeout(() => convertToGejosik(slideText.text, gejosikData[slideText.text]).then(() => setLoading(true)), 250);

  const onClickHandler = (() => {
    const funcMap = {
      "글씨가 너무 작아요.": setFontSize24,
      "폰트 사이즈가 일정하지 않아요.": unifyFontSize,
      "문장이 개조식이면 더 좋아요.": setSentenceToGejosik,
    };
    return funcMap[message] || null;
  })();

  return (
    <div className={styles.container}>
      <Badge className={badgeStyle} size="tiny" />
      <Body1 className={styles.text}>{message}</Body1>
      {onClickHandler !== null && (
        <Button
          className={styles.editButton}
          onClick={onClickHandler}
          appearance="subtle"
          size="small"
          icon={<Edit16Filled />}
        />
      )}
    </div>
  );
};

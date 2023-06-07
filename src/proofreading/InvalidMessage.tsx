import { Badge, Body1, Button, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { Edit16Filled } from "@fluentui/react-icons";
import React from "react";
import { SlideText } from "../common/main";
import { setFontSize } from "./common/slide";

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
};

export const InvalidMessage: React.FC<InvalidMessageProps> = ({
  slideText,
  badgeStyle,
  message,
}: InvalidMessageProps) => {
  const styles = useStyles();

  const setFontSize24 = () => setTimeout(() => setFontSize(slideText, 24), 250);

  return (
    <div className={styles.container}>
      <Badge className={badgeStyle} size="tiny" />
      <Body1 className={styles.text}>{message}</Body1>
      <Button
        className={styles.editButton}
        onClick={setFontSize24}
        appearance="subtle"
        size="small"
        icon={<Edit16Filled />}
      />
    </div>
  );
};

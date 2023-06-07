import { Badge, Body1, Button, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { Edit16Filled } from "@fluentui/react-icons";
import React from "react";

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
  badgeStyle: string;
  message: string;
};

export const InvalidMessage: React.FC<InvalidMessageProps> = ({ badgeStyle, message }: InvalidMessageProps) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Badge className={badgeStyle} size="tiny" />
      <Body1 className={styles.text}>{message}</Body1>
      <Button className={styles.editButton} appearance="subtle" size="small" icon={<Edit16Filled />} />
    </div>
  );
};

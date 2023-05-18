import { Badge, Body1, makeStyles, shorthands } from "@fluentui/react-components";
import React from "react";

const useStyles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
  },

  text: {
    ...shorthands.margin(0),
  },
});

type InvalidMessageProps = {
  badgeStyle: string;
  message: string;
};

const InvalidMessage: React.FC<InvalidMessageProps> = ({ badgeStyle, message }: InvalidMessageProps) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Badge className={badgeStyle} size="tiny" />
      <Body1 className={styles.text}>{message}</Body1>
    </div>
  );
};

export default InvalidMessage;

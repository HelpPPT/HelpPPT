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

  badge: {
    backgroundColor: "red",
    ...shorthands.margin(0, "8px", 0, "4px"),
  },
});

type InvalidMessageProps = {
  message: string;
};

const InvalidMessage: React.FC<InvalidMessageProps> = ({ message }: InvalidMessageProps) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Badge className={styles.badge} size="tiny" />
      <Body1 className={styles.text}>{message}</Body1>
    </div>
  );
};

export default InvalidMessage;

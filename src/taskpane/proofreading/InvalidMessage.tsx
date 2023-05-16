import { Body1, makeStyles, PresenceBadge, shorthands } from "@fluentui/react-components";
import React from "react";

const useStyles = makeStyles({
  text: {
    display: "flex",
    ...shorthands.margin(0),
  },

  textIcon: {
    ...shorthands.margin(0, "7px", 0, "15px"),
    backgroundColor: "transparent",
  },
});

type InvalidMessageProps = {
  message: string;
};

const InvalidMessage: React.FC<InvalidMessageProps> = ({ message }: InvalidMessageProps) => {
  const styles = useStyles();

  return (
    <Body1 className={styles.text}>
      <PresenceBadge className={styles.textIcon} size="small" status="out-of-office" />
      {message}
    </Body1>
  );
};

export default InvalidMessage;

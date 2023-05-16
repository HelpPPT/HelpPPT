import { Caption1, makeStyles, PresenceBadge, shorthands } from "@fluentui/react-components";
import React from "react";

const useStyles = makeStyles({
  text: {
    display: "flex",
    ...shorthands.margin(0),
    fontSize: "13px",
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
    <Caption1 className={styles.text}>
      <PresenceBadge className={styles.textIcon} size="small" status="out-of-office" />
      {message}
    </Caption1>
  );
};

export default InvalidMessage;

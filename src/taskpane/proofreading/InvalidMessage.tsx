import { Body2, makeStyles, PresenceBadge, shorthands } from "@fluentui/react-components";
import React from "react";

const useStyles = makeStyles({
  text: {
    ...shorthands.margin(0),
  },

  textIcon: {
    ...shorthands.margin(0, "8px", 0, "10px"),
  },
});

type InvalidMessageProps = {
  message: string;
};

const InvalidMessage: React.FC<InvalidMessageProps> = ({ message }: InvalidMessageProps) => {
  const styles = useStyles();

  return (
    <Body2 className={styles.text}>
      <PresenceBadge className={styles.textIcon} size="small" status="blocked" />
      {message}
    </Body2>
  );
};

export default InvalidMessage;

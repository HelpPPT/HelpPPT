import { Button, Card, CardHeader, makeStyles, shorthands, Subtitle2 } from "@fluentui/react-components";
import * as React from "react";

type OptionProps = {
  title: string;
  icon: React.ReactElement;
  name: string;
  optionEnum: any;
  options: any;
  optionHandler: (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLInputElement>) => void;
};

const useStyles = makeStyles({
  card: {
    maxWidth: "100%",
    height: "fit-content",
    ...shorthands.margin("10px"),
  },
  title: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    ...shorthands.margin("0.25rem", "0.3rem", 0, 0),
  },
  option: {
    display: "flex",
    flexWrap: "wrap",
  },
  button: {
    ...shorthands.margin("0.25rem", "0.25rem"),
  },
});

const Option: React.FunctionComponent<OptionProps> = ({
  title,
  icon,
  name,
  optionEnum,
  options,
  optionHandler,
}: OptionProps) => {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <CardHeader
        header={
          <div className={styles.title}>
            <div className={styles.icon}>{icon}</div>
            <Subtitle2>{title}</Subtitle2>
          </div>
        }
      />
      <div className={styles.option}>
        {(Object.keys(optionEnum) as Array<any>).map((elem, index) => (
          <Button
            key={index}
            className={styles.button}
            name={name}
            value={optionEnum[elem]}
            onClick={optionHandler}
            size="medium"
            appearance={options[name] === optionEnum[elem] ? "primary" : "secondary"}
          >
            {elem}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default Option;

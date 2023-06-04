import { Button, makeStyles, shorthands } from "@fluentui/react-components";
import * as React from "react";

type OptionProps = {
  name: string;
  optionEnum: any;
  options: any;
  optionHandler: (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLInputElement>) => void;
};

const useStyles = makeStyles({
  option: {
    display: "flex",
    flexWrap: "wrap",
    ...shorthands.padding(0, "0.5rem"),
  },
  button: {
    ...shorthands.margin("0.25rem", "0.25rem"),
  },
});

const Option: React.FunctionComponent<OptionProps> = ({ name, optionEnum, options, optionHandler }: OptionProps) => {
  const styles = useStyles();

  return (
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
  );
};

export default Option;

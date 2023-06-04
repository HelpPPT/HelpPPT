import { Button } from "@fluentui/react-components";
import * as React from "react";

type OptionProps = {
  name: string;
  optionEnum: any;
  options: any;
  optionHandler: (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLInputElement>) => void;
};

const Option: React.FunctionComponent<OptionProps> = ({ name, optionEnum, options, optionHandler }: OptionProps) => {
  return (
    <div>
      {(Object.keys(optionEnum) as Array<any>).map((elem, index) => (
        <Button
          key={index}
          name={name}
          value={optionEnum[elem]}
          onClick={optionHandler}
          size="large"
          appearance={options[name] === optionEnum[elem] ? "primary" : "secondary"}
        >
          {elem}
        </Button>
      ))}
    </div>
  );
};

export default Option;

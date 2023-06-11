import {
  Text,
  Card,
  Subtitle2,
  Checkbox,
  Button,
  makeStyles,
  shorthands,
  tokens,
  CardHeader,
} from "@fluentui/react-components";
import { BookSearch24Regular } from "@fluentui/react-icons";
import React from "react";

export interface OnBoardProps {
  checkedDomain: string;
  setCheckedDomain: (domain: string) => void;
  setIsCheckedDomain: (checked: boolean) => void;
}

export const OnBoard: React.FC<OnBoardProps> = ({ checkedDomain, setCheckedDomain, setIsCheckedDomain }) => {
  const classes = useStyles();
  const [showCheckPage, setShowCheckPage] = React.useState<boolean>(false);

  React.useEffect(() => {
    let timer = setTimeout(() => {
      setShowCheckPage(true);
    }, 2000);
    return () => clearTimeout(timer);
  });

  return showCheckPage ? (
    <Card className={classes.card}>
      <CardHeader
        header={
          <div className={classes.cardHeader}>
            <div className={classes.icon}>{<BookSearch24Regular />}</div>
            <Subtitle2>사용할 도메인을 선택해주세요</Subtitle2>
          </div>
        }
      />
      <div className={classes.cardItem}>
        <Checkbox
          checked={checkedDomain == "computer"}
          onChange={() => setCheckedDomain("computer")}
          label="컴퓨터 공학"
        />
        <Checkbox checked={checkedDomain == "chemistry"} onChange={() => setCheckedDomain("chemistry")} label="화학" />
        <Checkbox checked={checkedDomain == "biology"} onChange={() => setCheckedDomain("biology")} label="생물학" />
        <Checkbox
          checked={checkedDomain == "electric"}
          onChange={() => setCheckedDomain("electric")}
          label="전자 공학"
        />
        <Checkbox checked={checkedDomain == "economy"} onChange={() => setCheckedDomain("economy")} label="경제학" />
        <Checkbox
          checked={checkedDomain == "psychology"}
          onChange={() => setCheckedDomain("psychology")}
          label="심리학"
        />
        <Checkbox checked={checkedDomain == "null"} onChange={() => setCheckedDomain("null")} label="선택하지 않음" />
      </div>
      <div>
        <Button className={classes.nextBtn} onClick={() => setIsCheckedDomain(true)}>
          다음
        </Button>
      </div>
    </Card>
  ) : (
    <div className={classes.title}>
      <Text size={800} weight="bold" className={classes.text}>
        HelpPPT
      </Text>

      <Text size={500} weight="semibold">
        나만의 발표 제작 도우미
      </Text>
    </div>
  );
};

const useStyles = makeStyles({
  card: {
    ...shorthands.margin("30px"),
    display: "flex",
    alignItems: "center",
  },
  cardItem: {
    display: "flex",
    flexDirection: "column",
  },
  icon: {
    ...shorthands.margin("0.25rem", "0.3rem", 0, 0),
  },
  cardHeader: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    // ...shorthands.marginTop("50px")
  },

  title: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    ...shorthands.margin("10px"),
  },
  nextBtn: {
    backgroundColor: tokens.colorBrandForegroundOnLight,
    color: "white",
    ...shorthands.margin("5px"),
    alignItems: "center",
    "&:hover": {
      backgroundColor: tokens.colorBrandForegroundOnLightHover,
      color: "white",
    },
    "&:active": {
      backgroundColor: tokens.colorBrandForegroundOnLight,
      color: "white",
    },
  },
});

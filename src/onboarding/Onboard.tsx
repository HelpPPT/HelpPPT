import { Text, Card, Checkbox, Button, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { HeartCircleHint48Regular } from "@fluentui/react-icons";
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
      <header>사용할 도메인을 선택해주세요</header>
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
      <HeartCircleHint48Regular />
      <Text weight="semibold" className={classes.titleFont}>
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

  cardHeader: {
    fontWeight: "bold",
  },

  title: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  titleFont: {
    fontFamily: "GoryeongStrawberry",
  },

  nextBtn: {
    backgroundColor: tokens.colorBrandForegroundInverted,
    color: "white",
    ...shorthands.margin("5px"),
    alignItems: "center",
    "&:hover": {
      backgroundColor: tokens.colorBrandForegroundOnLightHover,
      color: "white",
    },
    "&:active": {
      backgroundColor: tokens.colorBrandForegroundInverted,
      color: "white",
    },
  },
});

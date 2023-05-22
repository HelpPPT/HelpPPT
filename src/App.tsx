import * as React from "react";
import Translation from "./translation/Translation";
import WordUnitier from "./wordunitier/WordUniter";
import Gejosik from "./gejosik/Gejosik";
import Proofreading from "./proofreading/Proofreading";
import OverflowTabList from "./OverflowTabList";
import {
  bundleIcon,
  Calendar3DayFilled,
  Calendar3DayRegular,
  CalendarAgendaFilled,
  CalendarAgendaRegular,
  CalendarDayFilled,
  CalendarDayRegular,
  CalendarTodayFilled,
  CalendarTodayRegular,
} from "@fluentui/react-icons";
import { makeStyles, tokens } from "@fluentui/react-components";

const Calendar3Day = bundleIcon(Calendar3DayFilled, Calendar3DayRegular);
const CalendarAgenda = bundleIcon(CalendarAgendaFilled, CalendarAgendaRegular);
const CalendarDay = bundleIcon(CalendarDayFilled, CalendarDayRegular);
const CalendarToday = bundleIcon(CalendarTodayFilled, CalendarTodayRegular);

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}
export type MenuTab = {
  id: string;
  name: string;
  icon: React.ReactElement;
};

const tabs: MenuTab[] = [
  {
    id: "wordUnitier",
    name: "단어 통일",
    icon: <CalendarToday />,
  },
  {
    id: "gejosik",
    name: "개조식 전환",
    icon: <CalendarAgenda />,
  },
  {
    id: "translation",
    name: "영단어 자동완성",
    icon: <CalendarDay />,
  },
  {
    id: "proofreading",
    name: "문장 교정",
    icon: <Calendar3Day />,
  },
];

const useStyles = makeStyles({
  panel: {
    height: "100%",
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

const App: React.FC<AppProps> = () => {
  const styles = useStyles();

  const [selectedPage, setSelectedPage] = React.useState<string>("proofreading");

  return (
    <div className={styles.panel}>
      <OverflowTabList tabs={tabs} selectedTabId={selectedPage} setSelectedTabId={setSelectedPage} />
      {selectedPage === "wordUnitier" && <WordUnitier />}
      {selectedPage === "gejosik" && <Gejosik />}
      {selectedPage === "translation" && <Translation />}
      {selectedPage === "proofreading" && <Proofreading />}
    </div>
  );
};

export default App;

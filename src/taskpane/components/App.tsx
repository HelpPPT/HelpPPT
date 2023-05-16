import * as React from "react";
import { Recommand } from "./Recommand";
import { WordUnitier } from "../../wordunitier/components/WordUniter";
import { Gejosik } from "./gejosik/Gejosik";
import { Tab, TabList, SelectTabData, SelectTabEvent, TabValue } from "@fluentui/react-components";
import Proofreading from "../proofreading/Proofreading";

enum Page {
  WordUnitier,
  Gejosik,
  Recommand,
  Proofreading,
}

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

const App: React.FC<AppProps> = () => {
  const [selectedPage, setSelectedPage] = React.useState<TabValue>(Page.Proofreading);

  const onTabSelect = (__event: SelectTabEvent, data: SelectTabData) => {
    setSelectedPage(data.value);
  };

  return (
    <div>
      <TabList className="menus" selectedValue={selectedPage} onTabSelect={onTabSelect}>
        <Tab value={Page.WordUnitier}>단어 통일</Tab>
        <Tab value={Page.Gejosik}>개조식 전환</Tab>
        <Tab value={Page.Recommand}>영단어 자동완성</Tab>
        <Tab value={Page.Proofreading}>문장 교정</Tab>
      </TabList>
      <div className="panel">
        {selectedPage === Page.WordUnitier && <WordUnitier />}
        {selectedPage === Page.Gejosik && <Gejosik />}
        {selectedPage === Page.Recommand && <Recommand />}
        {selectedPage === Page.Proofreading && <Proofreading />}
      </div>
    </div>
  );
};

export default App;

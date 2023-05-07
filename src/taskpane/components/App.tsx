import * as React from "react";
import Header from "./Header";
import { HeroListItem } from "./HeroList";
import { Recommand } from "./Recommand";
import { WordUnitier } from "./WordUnitier";
import { Gejosik } from "./Gejosik";
import { Pivot, PivotItem } from "@fluentui/react";

/* global console, Office, require */

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  listItems: HeroListItem[];
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
    };
  }

  render() {
    return (
      <Pivot
        className="menus"
        aria-label="기능 페이지"
        overflowAriaLabel="기능 더보기"
        overflowBehavior="menu"
        style={{ height: "100%" }}
      >
        <PivotItem headerText="단어 통일">
          <WordUnitier />
        </PivotItem>
        <PivotItem headerText="개조식 전환">
          <Gejosik />
        </PivotItem>
        <PivotItem headerText="영문 자동 완성">
          <Recommand />
        </PivotItem>
      </Pivot>
    );
  }
}

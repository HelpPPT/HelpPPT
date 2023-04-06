import * as React from "react";
import Header from "./Header";
import { HeroListItem } from "./HeroList";
// import { Recommand } from "./Recommand";
// import { WordUnitier } from "./WordUnitier";
import { Gejosik } from "./Gejosik";

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
      <div className="ms-welcome">
        <Header logo={require("./../../../assets/logo-filled.png")} title={this.props.title} message="Welcome" />
        {/* <Recommand /> */}
        {/* <WordUnitier /> */}
        <Gejosik />
      </div>
    );
  }
}

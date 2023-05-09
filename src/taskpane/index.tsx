import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/App";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { AppContainer } from "react-hot-loader";
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";

/* global document, Office, module, require */

initializeIcons();

let isOfficeInitialized = false;

const title = "Contoso Task Pane Add-in";

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <FluentProvider theme={teamsLightTheme} style={{ height: "100%" }}>
        <Component title={title} isOfficeInitialized={isOfficeInitialized} />
      </FluentProvider>
    </AppContainer>,
    document.getElementById("container")
  );
};

/* Render application after Office initializes */
Office.onReady(() => {
  isOfficeInitialized = true;
  render(App);
});

if ((module as any).hot) {
  (module as any).hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    render(NextApp);
  });
}

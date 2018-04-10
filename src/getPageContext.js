/* eslint-disable no-underscore-dangle */

import { SheetsRegistry } from 'jss';
import { createMuiTheme, createGenerateClassName } from 'material-ui/styles';
import grey from 'material-ui/colors/grey';
import blueGrey from 'material-ui/colors/blueGrey';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  shadows: new Array(25).fill("null"),
  palette: {
    primary: {
      light: grey[50],
      main: '#F3F4F6',
      dark: grey[300],
    },
    secondary: {
      light: blueGrey[300],
      main: blueGrey[500],
      dark: blueGrey[700],
    },
  },
});

function createPageContext() {
  return {
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName(),
  };
}

export default function getPageContext() {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (!process.browser) {
    return createPageContext();
  }

  // Reuse context on the client-side.
  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createPageContext();
  }

  return global.__INIT_MATERIAL_UI__;
}

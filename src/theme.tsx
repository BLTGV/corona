import { createMuiTheme } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ffab01",
      light: "#ffc777"
    },
    secondary: {
      main: "#0155ff"
    },
    error: {
      main: red.A400
    },
    background: {
      default: "#ebebeb"
    },
    text: {
      primary: "#474747",
      secondary: "#707070",
      disabled: "#d6d6d6"
    }
  }
});

export default theme;

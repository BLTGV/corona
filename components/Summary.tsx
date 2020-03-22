import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";
import { useSelectedLocaleData } from "../src/state";
import { isNil } from "ramda";

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1
  }
});

export default function Summary() {
  const classes = useStyles();
  const data = useSelectedLocaleData();

  if(isNil(data)) return null;

  return (
    <React.Fragment>
      <Title>Totals</Title>
      <Typography component="p" variant="h4">
        {data.lastCumulativeDeaths}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        deaths as of {data.lastPeriod}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault} hidden={true}>
          View More
        </Link>
      </div>
    </React.Fragment>
  );
}

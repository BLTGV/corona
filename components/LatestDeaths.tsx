import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import { useJHUAggregateData} from '../src/data';
import { take } from 'ramda';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function LatestDeaths() {
  const classes = useStyles();
  const data = useJHUAggregateData();
  const subset = take(10, data.locations);
  return (
    <React.Fragment>
      <Title>Significant Deaths as of {subset[0].lastPeriod}</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Country/Region</TableCell>
            <TableCell>Provence/State</TableCell>
            <TableCell align="right">Current</TableCell>
            <TableCell align="right">Cumulative</TableCell>
            <TableCell align="right">7-day MA</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subset.map((row) => (
            <TableRow key={`${row.countryOrRegion}${row.provenceOrState}`}>
              <TableCell>{row.countryOrRegion}</TableCell>
              <TableCell>{row.provenceOrState}</TableCell>
              <TableCell align="right">{row.lastDeltaDeaths}</TableCell>
              <TableCell align="right">{row.lastCumulativeDeaths}</TableCell>
              <TableCell align="right">{row.lastMovingAverageDeaths}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more orders
        </Link>
      </div>
    </React.Fragment>
  );
}
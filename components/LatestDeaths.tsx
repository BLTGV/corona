import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import { useJHUAggregateData } from "../src/data";
import { take } from "ramda";
import { useSelectionState } from "../src/state";
import MUIDataTable from "mui-datatables";
import theme from "../src/theme";

function preventDefault(event) {
  event.preventDefault();
}

const COLUMNS = [
  {
    name: "countryOrRegion",
    label: "Country/Region",
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: "provenceOrState",
    label: "Provence/State",
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: "lastDeltaDeaths",
    label: "Current",
    options: {
      filter: false,
      sort: true
    }
  },
  {
    name: "lastCumulativeDeaths",
    label: "Cumulative",
    options: {
      filter: false,
      sort: true
    }
  },
  {
    name: "lastMovingAverageDeaths",
    label: "Seven-day MA",
    options: {
      filter: false,
      sort: true
    }
  }
];

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3)
  }
}));

export default function LatestDeaths() {
  const classes = useStyles();
  const { selectedCountry, selectedProvence } = useSelectionState();
  const data = useJHUAggregateData();
  const subset = take(10, data.locations);
  
  // const getMuiTheme = () => createMuiTheme({
  //   overrides: {
  //     MuiTypography: {
  //       h6: {
  //         color: <theme className="palette prim"></theme>
  //       }
  //     }
  //   }
  // })

  const options = {
    filterType: "checkbox",
    selectableRows: "none",
    rowsPerPage: 15,
    customToolbarSelect: () => null
  };

  return (
    <MUIDataTable
      title={"Latest Virus Deaths"}
      data={data.locations}
      columns={COLUMNS}
      options={options}
      responsive="scrollFullHeight"
    />
  );
}

// <React.Fragment>
//   <Title>Significant Deaths as of {subset[0].lastPeriod}</Title>
//   <Table size="small">
//     <TableHead>
//       <TableRow>
//         <TableCell>Country/Region</TableCell>
//         <TableCell>Provence/State</TableCell>
//         <TableCell align="right">Current</TableCell>
//         <TableCell align="right">Cumulative</TableCell>
//         <TableCell align="right">7-day MA</TableCell>
//       </TableRow>
//     </TableHead>
//     <TableBody>
//       {subset.map(row => (
//         <TableRow
//           key={`${row.countryOrRegion}${row.provenceOrState}`}
//           hover={true}
//           selected={row.countryOrRegion === selectedCountry && row.provenceOrState === selectedProvence}
//         >
//           <TableCell>{row.countryOrRegion}</TableCell>
//           <TableCell>{row.provenceOrState}</TableCell>
//           <TableCell align="right">{row.lastDeltaDeaths}</TableCell>
//           <TableCell align="right">{row.lastCumulativeDeaths}</TableCell>
//           <TableCell align="right">{row.lastMovingAverageDeaths}</TableCell>
//         </TableRow>
//       ))}
//     </TableBody>
//   </Table>
//   <div className={classes.seeMore}>
//     <Link color="primary" href="#" onClick={preventDefault} hidden={true}>
//       See more orders
//     </Link>
//   </div>
// </React.Fragment>

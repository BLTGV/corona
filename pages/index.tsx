import React, { useState, useEffect, useReducer } from "react";
import Head from "next/head";
import {
  CssBaseline,
  Container,
  Grid,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  NoSsr
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { Autocomplete } from "@material-ui/lab";
import { uniq } from "ramda";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

import { getJHUAggregateData, LocationData, JHUAggregateData } from "../src/data";
import Dashboard from "../components/Dashboard";
import { withAppProviders } from "../src/util";

const Chart = ({ data }) => {
  return (
    <LineChart
      width={700}
      height={400}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="deltaDeaths" stroke="#8884d8" />
      <Line type="monotone" dataKey="movingAverageDeaths" stroke="#82ca9d" />
    </LineChart>
  );
};

const Home = ({ data }: { data: LocationData[] }) => {
  const [transformedData] = useState(
    // data.filter(({ countryOrRegion }) => countryOrRegion === "Italy")
    data
  );
  const [shouldRender, setShouldRender] = useState(false);
  useEffect(() => {
    setShouldRender(true);
  }, []);
  const initialSelectionState = {
    selectedCountry: "",
    selectedProvence: ""
  };

  const selectionStateReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_COUNTRY":
        return {
          selectedCountry: action.selectedCountry,
          selectedProvence: ""
        };
      case "CHANGE_PROVENCE":
        return {
          ...state,
          selectedProvence: action.selectedProvence
        };
      default:
        return state;
    }
  };

  const [selections, dispatch] = useReducer(
    selectionStateReducer,
    initialSelectionState
  );

  const [selectedSeries] = transformedData
    .filter(
      ({ countryOrRegion }) => countryOrRegion === selections.selectedCountry
    )
    .filter(
      ({ provenceOrState }) => provenceOrState === selections.selectedProvence
    )
    .map(({ series }) => series);

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Corona Virus Supplemental Graphs
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              id="combo-box-countryOrRegion"
              options={uniq(
                data.map(({ countryOrRegion }) => countryOrRegion).sort()
              )}
              value={selections.selectedCountry}
              onChange={(e, v) =>
                dispatch({ type: "CHANGE_COUNTRY", selectedCountry: v })
              }
              getOptionLabel={option => option}
              style={{ width: 300 }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Country/Region"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              id="combo-box-provenceOrState"
              options={uniq(
                data
                  .filter(
                    ({ countryOrRegion }) =>
                      countryOrRegion === selections.selectedCountry
                  )
                  .map(({ provenceOrState }) => provenceOrState)
                  .sort()
              )}
              value={selections.selectedProvence}
              disabled={selections.selectedCountry === ""}
              onChange={(e, v) =>
                dispatch({ type: "CHANGE_PROVENCE", selectedProvence: v })
              }
              getOptionLabel={option => option}
              style={{ width: 300 }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Provence/State"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          {shouldRender && selectedSeries && (
            <Grid item xs={12}>
              {" "}
              <Chart data={selectedSeries} />
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default withAppProviders(Dashboard);

// This function gets called at build time
export async function getStaticProps() {
  const data = await getJHUAggregateData();

  return {
    props: {
      data
    }
  };
}

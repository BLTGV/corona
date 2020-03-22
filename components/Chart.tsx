import React from "react";
import { useTheme } from "@material-ui/core/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  Legend,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import Title from "./Title";
import { useSelectedLocaleData } from "../src/state";

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

export default function Chart() {
  const theme = useTheme();
  const data = useSelectedLocaleData();

  const filteredSeries = data.series.filter(
    ({ cumulativeDeaths }) => cumulativeDeaths > 0
  );

  return (
    <React.Fragment>
      <Title>{`${data.countryOrRegion} -- ${data.provenceOrState}`}</Title>
      <ResponsiveContainer>
        <LineChart
          data={filteredSeries}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24
          }}
        >
          <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: "middle", fill: theme.palette.text.primary }}
            >
              Deaths
            </Label>
          </YAxis>
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="deltaDeaths"
            stroke={theme.palette.primary.main}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="movingAverageDeaths"
            stroke={theme.palette.secondary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}

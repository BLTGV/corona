import fetch from "node-fetch";
import Papa from "papaparse";
import { keys, isNil } from "ramda";
import { isValid } from "date-fns";
import { ma } from "moving-averages";

const URL =
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv";

export interface CoronaTrackerCsvRow {
  "Provence/State": string;
  "Country/Region": string;
  Lat: string;
  Long: string;
  [date: string]: string;
}

export const retrieveData = async (): Promise<CoronaTrackerCsvRow[]> => {
  const res = await fetch(URL);
  const rows = await res.text();

  const data = Papa.parse(rows, { header: true });

  return data.data;
};

export interface SeriesDatum {
  date: string;
  cumulativeDeaths: number;
  deltaDeaths: number;
  movingAverageDeaths: number;
}

export interface LocationData {
  sourceDatum: CoronaTrackerCsvRow;
  countryOrRegion: string;
  provenceOrState: string;
  series: SeriesDatum[];
}

export const transformDatum = (datum: CoronaTrackerCsvRow): LocationData => {
  const isKeyDate = (key: string) => {
    return isValid(new Date(key));
  };

  const dateKeys = keys(datum).filter(isKeyDate);
  const withCumulativeSeries = dateKeys.map(
    (date: string): SeriesDatum => ({
      date,
      cumulativeDeaths: Number.parseInt(datum[date]),
      deltaDeaths: 0,
      movingAverageDeaths: 0
    })
  );
  const withDeltaSeries: SeriesDatum[] = withCumulativeSeries.map((v, i, a) => {
    if (i === 0) return { ...v, deltaDeaths: 0 };
    return {
      ...v,
      deltaDeaths: a[i].cumulativeDeaths - a[i - 1].cumulativeDeaths
    };
  });
  const deltaSeriesDeathsMovingAverage = ma(
    withDeltaSeries.map(({ deltaDeaths }) => deltaDeaths),
    7
  );
  const withMovingAverageDeltaSeries: SeriesDatum[] = withDeltaSeries.map(
    (v, i, a) => {
      if (isNil(deltaSeriesDeathsMovingAverage[i]))
        return { ...v, movingAverageDeaths: 0 };
      return {
        ...v,
        movingAverageDeaths:
          Math.round(
            (deltaSeriesDeathsMovingAverage[i] + Number.EPSILON) * 100
          ) / 100
      };
    }
  );

  return {
    sourceDatum: datum,
    series: withMovingAverageDeltaSeries,
    countryOrRegion: datum["Country/Region"],
    provenceOrState: datum["Province/State"]
  };
};

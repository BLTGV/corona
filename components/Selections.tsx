import { Autocomplete } from "@material-ui/lab";
import { TextField, Box } from "@material-ui/core";
import { useSelectionState } from "../src/state";
import { useJHUAggregateData } from "../src/data";
import { uniq, includes, isNil, keys, equals } from "ramda";
import { useCallback } from "react";

export default function Selections() {
  const {
    selectedCountry,
    selectedProvence,
    handleCountryChange,
    handleProvenceChange
  } = useSelectionState();

  const { locations, locationsMap } = useJHUAggregateData();

  const onProvenceChange = useCallback((e, v, reason: string) => {
    if (isNil(v)) return handleProvenceChange("");
    return handleProvenceChange(v);
  }, []);

  const countryOption: any = keys(locationsMap).sort();
  const provenceOption: any = isNil(locationsMap[selectedCountry])
    ? [""]
    : keys(locationsMap[selectedCountry])
        .sort()
        .filter(v => v !== "");

  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center">
      <Box m={3}>
        <Autocomplete
          id="combo-box-countryOrRegion"
          options={countryOption}
          value={selectedCountry}
          onChange={(e, v) => handleCountryChange(v)}
          getOptionLabel={option => option}
          style={{ width: 300 }}
          renderInput={params => (
            <TextField {...params} label="Country/Region" variant="outlined" />
          )}
        />
      </Box>
      <Box m={3}>
        <Autocomplete
          id="combo-box-provenceOrState"
          options={provenceOption}
          value={selectedProvence}
          disabled={selectedCountry === ""}
          onChange={onProvenceChange}
          getOptionLabel={option => option}
          style={{ width: 300 }}
          renderInput={params => (
            <TextField {...params} label="Provence/State" variant="outlined" />
          )}
        />
      </Box>
    </Box>
  );
}

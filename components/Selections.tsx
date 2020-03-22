import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import { useSelectionState } from "../src/state";
import { useJHUAggregateData } from "../src/data";
import { uniq } from "ramda";

export default function Selections() {
  const {
    selectedCountry,
    selectedProvence,
    handleCountryChange,
    handleProvenceChange
  } = useSelectionState();

  const { locations } = useJHUAggregateData();
  
  return (
    <>
      <Autocomplete
        id="combo-box-countryOrRegion"
        options={uniq(
          locations.map(({ countryOrRegion }) => countryOrRegion).sort()
        )}
        value={selectedCountry}
        onChange={(e, v) => handleCountryChange(v)}
        getOptionLabel={option => option}
        style={{ width: 300 }}
        renderInput={params => (
          <TextField {...params} label="Country/Region" variant="outlined" />
        )}
      />
      <Autocomplete
        id="combo-box-provenceOrState"
        options={uniq(
          locations
            .filter(
              ({ countryOrRegion }) => countryOrRegion === selectedCountry
            )
            .map(({ provenceOrState }) => provenceOrState)
            .sort()
        )}
        value={selectedProvence}
        disabled={selectedCountry === ""}
        onChange={(e, v) => handleProvenceChange(v)}
        getOptionLabel={option => option}
        style={{ width: 300 }}
        renderInput={params => (
          <TextField {...params} label="Provence/State" variant="outlined" />
        )}
      />
    </>
  );
}

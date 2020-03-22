import { JHUAggregateData, useJHUAggregateData, LocationData } from "./data";
import {
  useReducer,
  createContext,
  useMemo,
  useContext,
  Dispatch
} from "react";
import { path } from "ramda";

export interface SelectionState {
  selectedCountry: string;
  selectedProvence: string;
}

interface SelectionStateAction {
  selectedCountry?: string;
  selectedProvence?: string;
  type: string;
}

const defaultSelectionState: SelectionState = {
  selectedCountry: "",
  selectedProvence: ""
};

const SelectionStateStoreContext = createContext(null);

const selectionStateReducer = (
  state: SelectionState,
  action: SelectionStateAction
): SelectionState => {
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

export function SelectionStateStoreProvider({ children, data }) {
  // TODO: Could cause issues
  const initialSelectionState: SelectionState = data
    ? {
        selectedCountry: data.locations[0].countryOrRegion,
        selectedProvence: data.locations[0].provenceOrState
      }
    : defaultSelectionState;

  const [selections, dispatch] = useReducer(
    selectionStateReducer,
    initialSelectionState
  );

  const contextValue = useMemo(() => ({ selections, dispatch }), [
    selections,
    dispatch
  ]);

  return (
    <SelectionStateStoreContext.Provider value={contextValue}>
      {children}
    </SelectionStateStoreContext.Provider>
  );
}

export function useSelectionState() {
  const {
    selections,
    dispatch
  }: {
    selections: SelectionState;
    dispatch: Dispatch<SelectionStateAction>;
  } = useContext(SelectionStateStoreContext);

  const handleCountryChange = (newValue: string) =>
    dispatch({ type: "CHANGE_COUNTRY", selectedCountry: newValue });
  const handleProvenceChange = (newValue: string) =>
    dispatch({ type: "CHANGE_PROVENCE", selectedProvence: newValue });

  return {
    selectedCountry: selections.selectedCountry,
    selectedProvence: selections.selectedProvence,
    handleCountryChange,
    handleProvenceChange
  };
}

export function useSelectedLocaleData() {
  const data = useJHUAggregateData();
  const { selectedCountry, selectedProvence } = useSelectionState();
  const selectedSeries: LocationData = path(
    [selectedCountry, selectedProvence],
    data.locationsMap
  );

  return selectedSeries;
}

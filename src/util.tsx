import React, { useState, useEffect, Component } from "react";
import { curry } from "ramda";
import { JHUAggregateDataContext, JHUAggregateData } from "./data";
import { SelectionStateStoreProvider } from "./state";

export function useHasMounted(): boolean {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}

export const withAppProviders = (WrappedComponent: any) => ({
  data
}: {
  data: JHUAggregateData;
}) => {
  useEffect(() => {
    console.log(data);
  }, []);
  return (
    <JHUAggregateDataContext.Provider value={data}>
      <SelectionStateStoreProvider data={data}>
        <WrappedComponent />
      </SelectionStateStoreProvider>
    </JHUAggregateDataContext.Provider>
  );
};

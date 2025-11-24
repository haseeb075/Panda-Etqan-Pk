import { configureStore } from "@reduxjs/toolkit";
import backMarginReducer from "./slices/backMarginSlice";

export const store = configureStore({
  reducer: {
    backMargin: backMarginReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

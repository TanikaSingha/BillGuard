import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "../lib/Slices/locationSlice";
import userReducer from "../lib/Slices/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    location: locationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

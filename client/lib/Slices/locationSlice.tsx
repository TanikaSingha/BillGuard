import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as Location from "expo-location";

// Async thunk to fetch location
export const refreshLocation = createAsyncThunk(
  "location/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return rejectWithValue("Permission denied");
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      return loc;
    } catch (err) {
      return rejectWithValue("Failed to fetch location");
    }
  }
);

interface LocationState {
  location: Location.LocationObject | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: LocationState = {
  location: null,
  status: "idle",
  error: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(refreshLocation.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(refreshLocation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.location = action.payload;
      })
      .addCase(refreshLocation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default locationSlice.reducer;

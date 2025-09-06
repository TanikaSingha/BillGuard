import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import apiRequest from "../utils/apiRequest";

interface Billboard {
  id: string;
  imageURL: string;
  location: any;
  crowdConfidence: number;
  verifiedStatus: string;
}

interface BillBoardState {
  billboards: Billboard[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BillBoardState = {
  billboards: [],
  status: "idle",
  error: null,
};

export const getBillBoardFeed = createAsyncThunk<
  Billboard[],
  void,
  { rejectValue: string }
>("billboard/getBillBoardFeed", async (_, { rejectWithValue }) => {
  try {
    const response = await apiRequest.get("/billboard/feed", {
      headers: {
        Authorization: `Bearer ${await SecureStore.getItemAsync("authToken")}`,
      },
    });
    console.log(response.data);
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch billboards");
  }
});

const billBoardSlice = createSlice({
  name: "billboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBillBoardFeed.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getBillBoardFeed.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.billboards = action.payload;
      })
      .addCase(getBillBoardFeed.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export default billBoardSlice.reducer;

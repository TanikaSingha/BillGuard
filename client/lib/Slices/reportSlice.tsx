import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocationObject } from "expo-location";
import apiRequest from "../utils/apiRequest";
export type ExifData = Record<string, any>;

interface SuspectedDimensions {
  height?: number;
  width?: number;
}

interface ReportState {
  imageUrl: string | null;
  annotatedUrl: string | null;
  issueDescription: string;
  violationType: string[]; // allow multiple user-selected violations
  location: LocationObject | null;
  suspectedDimensions: { height?: number; width?: number } | null;
  estimatedDistance: number | null; // ⬅️ NEW user input
  qrCodeDetected: boolean;
  licenseId: string | null;
  exifData: ExifData | null;
  submitting: boolean;
  error: string | null;

  aiAnalysis: {
    verdict: "unauthorized" | "authorized" | "unsure";
    confidence: number;
    detectedObjects: string[];
  } | null;
  userOverrideVerdict: "unauthorized" | "authorized" | "unsure" | null;
}
export interface SubmitReportPayload {
  imageURL: string;
  annotatedURL: string;
  issueDescription: string;
  violationType: string[];
  location: LocationObject | null;
  suspectedDimensions: any;
  qrCodeDetected: any;
  licenseId: any;
  aiAnalysis: {
    verdict: string;
    confidence: number;
    detectedObjects: string[];
  };
}

const initialState: ReportState = {
  imageUrl: null,
  annotatedUrl: null,
  issueDescription: "",
  violationType: [],
  location: null,
  suspectedDimensions: null,
  qrCodeDetected: false,
  licenseId: null,
  exifData: null,
  submitting: false,
  error: null,
  estimatedDistance: null,
  aiAnalysis: null,
  userOverrideVerdict: null,
};

// 🔹 Async thunk to submit a report to backend
export const submitReport = createAsyncThunk<
  any, // Return type of the thunk
  SubmitReportPayload // Payload type
>("report/submitReport", async (payload, thunkAPI) => {
  // Replace with your actual API call logic
  // Example:
  // const response = await apiRequest.post("/report", payload);
  // return response.data;
  return {}; // Placeholder
});

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setImageUrl(state, action: PayloadAction<string>) {
      state.imageUrl = action.payload;
    },
    setAnnotatedUrl(state, action: PayloadAction<string>) {
      state.annotatedUrl = action.payload;
    },
    setIssueDescription(state, action: PayloadAction<string>) {
      state.issueDescription = action.payload;
    },
    setViolationType(state, action: PayloadAction<string[]>) {
      state.violationType = action.payload;
    },
    setLocation(state, action: PayloadAction<ReportState["location"]>) {
      state.location = action.payload;
    },
    setSuspectedDimensions(state, action: PayloadAction<SuspectedDimensions>) {
      state.suspectedDimensions = action.payload;
    },
    setExifData(state, action: PayloadAction<ExifData>) {
      state.exifData = action.payload;
    },
    resetReport(state) {
      return initialState;
    },
    setEstimatedDistance(state, action: PayloadAction<number>) {
      state.estimatedDistance = action.payload;
    },
    setAiAnalysis(state, action: PayloadAction<ReportState["aiAnalysis"]>) {
      state.aiAnalysis = action.payload;
    },
    setUserOverrideVerdict(
      state,
      action: PayloadAction<"unauthorized" | "authorized" | "unsure">
    ) {
      state.userOverrideVerdict = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitReport.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitReport.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(submitReport.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setImageUrl,
  setAnnotatedUrl,
  setIssueDescription,
  setViolationType,
  setLocation,
  setSuspectedDimensions,
  setExifData,
  resetReport,
} = reportSlice.actions;

export default reportSlice.reducer;

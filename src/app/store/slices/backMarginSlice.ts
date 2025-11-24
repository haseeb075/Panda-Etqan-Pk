import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BackMarginData } from "@/utils/dummyData";
import { fetchBackMarginData } from "@/services/api";

interface BackMarginState {
  data: BackMarginData[];
  loading: boolean;
  error: string | null;
}

const initialState: BackMarginState = {
  data: [],
  loading: false,
  error: null,
};

// Async thunk to fetch data from API
export const fetchBackMargin = createAsyncThunk(
  "backMargin/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchBackMarginData();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch data"
      );
    }
  }
);

const backMarginSlice = createSlice({
  name: "backMargin",
  initialState,
  reducers: {
    // You can add other actions here if needed
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBackMargin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBackMargin.fulfilled,
        (state, action: PayloadAction<BackMarginData[]>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchBackMargin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = backMarginSlice.actions;
export default backMarginSlice.reducer;

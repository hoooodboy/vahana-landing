import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const getSettings = createAsyncThunk("setting/getSettings", async () => {
  const response = await api.get("/settings/statics");
  return response.data.result;
});

export const settingSlice = createSlice({
  name: "setting",
  initialState: {
    static: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSettings.fulfilled, (state, action) => {
      state.static = action.payload;
    });
  },
});

export default settingSlice.reducer;

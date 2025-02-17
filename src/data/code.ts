import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const getCodes = createAsyncThunk("code/getCodes", async () => {
  const response = await api.get("/codes/map");
  return response.data.result;
});

export const codeSlice = createSlice({
  name: "code",
  initialState: {
    map: {},
    tree: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCodes.fulfilled, (state, action) => {
      state.map = action.payload.map;
      state.tree = action.payload.tree;
    });
  },
});

export default codeSlice.reducer;

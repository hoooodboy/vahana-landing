import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const me = createAsyncThunk("/auth/login", async () => {
  const { data } = await api.get(`/api/auth/login`);
  return data?.result || data;
});

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    principal: undefined,
  },
  reducers: {
    setPrincipal: (state, action) => {
      state.principal = action.payload;
      window.sessionStorage.setItem(
        "principal",
        JSON.stringify(action.payload)
      );
    },
    clearPrincipal: (state) => {
      window.sessionStorage.clear();
      state.principal = undefined;
      console.log("...??");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(me.fulfilled, (state, action) => {
      state.principal = action.payload;
    });
  },
});

export const { setPrincipal, clearPrincipal } = authSlice.actions;

export default authSlice.reducer;

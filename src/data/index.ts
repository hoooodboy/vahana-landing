import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../data/auth";
import codeReducer from "../data/code";
import settingReducer from "../data/setting";

export default configureStore({
  reducer: {
    auth: authReducer,
    code: codeReducer,
    setting: settingReducer,
  },
});

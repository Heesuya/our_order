import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";

export default configureStore({
  reducer: {
    user: userReducer,
  },
  devTools: true, // Redux DevTools 활성화
});

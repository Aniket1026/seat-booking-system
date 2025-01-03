import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "./bookingSlice";
import seatReducer from "./seatSlice";
import userReducer from "./userSlice";


export const store = configureStore({
  reducer: {
    seats: seatReducer,
    booking: bookingReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Booking } from "../../types/Booking.type";

const URL = process.env.NEXT_PUBLIC_API_URL!;

interface BookingState {
  booking: Booking[] | [];
  status: "loading" | "success" | "failed";
  error: string | null;
}

const initialState: BookingState = {
  booking: [],
  status: "loading",
  error: null,
};

export const bookSeats = createAsyncThunk(
  "booking/bookSeats",
  async (numOfSeats: number) => {
    try {
      const response = await fetch(`${`${URL}/booking/book-seat`}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ numOfSeats }),
        credentials: "include",
      });
      if (response.status === 400) { 
        throw new Error("Not enough contiguous or nearby seats available");
      }
      return response.json();
    } catch (error: any) {
      throw new Error("Error in getting bookings: " + error.message);
    }
  }
);

export const bookingHistory = createAsyncThunk(
  "booking/fetchBookingHistory",
  async () => {
    try {
      const response = await fetch(`${`${URL}/booking/booking-history`}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      return response.json();
    } catch (error: any) {
      throw new Error("Error in getting bookings: " + error.message);
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(bookSeats.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(bookSeats.fulfilled, (state, action) => {
      state.status = "success";
      state.booking = action.payload;
    });
    builder.addCase(bookSeats.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || null;
    });
    builder.addCase(bookingHistory.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(bookingHistory.fulfilled, (state, action) => {
      state.status = "success";
      state.booking = action.payload;
    });
    builder.addCase(bookingHistory.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || null;
    })
  }
});

export default bookingSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Seat } from "../../types/Seat.type";

const URL = process.env.NEXT_PUBLIC_API_URL!;


interface SeatState {
  seats: Seat[] | null;
  status: "loading" | "success" | "failed";
  error: string | null;
}

const initialState: SeatState = {
  seats: [],
  status: "loading",
  error: null,
};

export const fetchSeats = createAsyncThunk("booking/fetchSeats", async () => {
  try {
    const response = await fetch(`${`${URL}/booking/seats`}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    console.log("Fetched seats : ");
    // console.log("Fetched seats : ",response.json());
    return response.json() as Promise<Seat[]>;
  } catch (error: any) {
    throw new Error("Error in getting bookings: " + error.message);
  }
});

export const resetAllSeats = createAsyncThunk("booking/resetSeats", async () => {
  try {
    const response = await fetch(`${`${URL}/booking/reset`}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    console.log("Fetched seats : ", response.json());
    return response.json() as Promise<Seat[]>;
  } catch (error: any) {
    throw new Error("Error in getting bookings: " + error.message);
  }
});

const seatSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSeats.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchSeats.fulfilled, (state, action) => {
      state.status = "success";
      state.seats = action.payload;
    });
    builder.addCase(fetchSeats.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || null;
    });
    builder.addCase(resetAllSeats.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(resetAllSeats.fulfilled, (state, action) => {
      state.status = "success";
      state.seats = action.payload;
    });
  },
});

export default seatSlice.reducer;

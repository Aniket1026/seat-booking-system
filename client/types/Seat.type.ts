import { Booking } from "./Booking.type";

export interface Seat {
  id: number;
  seatNumber: number;
  rowNumber: number;
  booked: boolean;
  booingID?: number;
  booking?: Booking;
}

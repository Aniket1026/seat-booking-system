import Booking from "./booking.interface";

export default interface Seat {
  id: number;
  seatNumber: number;
  rowNumber: number;
  booked: boolean;
  booingID?: number;
  booking?: Booking;
}

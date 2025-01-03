import Booking from "./booking.interface";

export default interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  bookings: Booking[];
}

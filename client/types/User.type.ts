import { Booking } from "./Booking.type";

export interface User {
  id?: number;
  name?: string;
  email: string;
  password: string;
  createdAt?: Date;
  bookings?: Booking[];
}

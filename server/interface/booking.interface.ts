import Seat from "./seat.interface";
import User from "./user.interface";

export default interface Booking {
  id: number;
  userId: number;
  user?: User;
  seats: Seat[];
  createdAt: Date;
}

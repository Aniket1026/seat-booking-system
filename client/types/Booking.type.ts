import { Seat } from './Seat.type';
import { User } from './User.type';

export interface Booking {
  id: number;
  userId: number;
  user?: User;
  seats: Seat[];
  createdAt: Date;
}

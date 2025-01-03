import { Router } from "express";

import { bookSeat, getAllSeats, getBookings, resetSeats } from "../controllers/booking";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/seats" ,getAllSeats);
router.post("/book-seat",authMiddleware, bookSeat);
router.post("/reset", authMiddleware, resetSeats);
router.get("/booking-history", authMiddleware, getBookings);

export const bookingRouter = router;

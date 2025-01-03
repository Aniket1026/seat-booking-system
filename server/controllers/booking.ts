import { PrismaClient } from "@prisma/client";
import { SeatBookingService } from "../services/seatBookingService";
import { CustomRequest } from "../interface/customRequest";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getAllSeats = async (
  req: Request,
  res: Response,
  next: () => void
) => {
  try {
    const seats = await prisma.seat.findMany({
      orderBy: [{ rowNumber: "asc" }, { seatNumber: "asc" }],
    });
    res.status(200).json({ seats });
  } catch (error: any) {
    throw new Error("Error in getting bookings: " + error.message);
  }
};

export const bookSeat = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { numOfSeats } = req.body;

    if (!numOfSeats) {
      res.status(400).json({ error: "Number of seats is required" });
      return;
    }

    if (numOfSeats > 7) {
      res.status(400).json({ error: "Cannot book more than 7 seats at once" });
      return;
    }

    const userId = req.user.id;

    console.log("Booking seats for user:", userId);

    try {
      // Find available seats
      const availableSeatIds = await SeatBookingService.findAvailableSeats(
        numOfSeats
      );

      console.log("Available Seat IDs:", availableSeatIds);

      if (!availableSeatIds || availableSeatIds.length !== numOfSeats) {
        res.status(400).json({
          error: "Not enough contiguous or nearby seats available",
        });
        return;
      }

      const booking = await SeatBookingService.bookSeats(
        availableSeatIds,
        userId
      );

      // Fetching the booked seats details
      const bookedSeats = await prisma.seat.findMany({
        where: {
          bookingId: booking.id,
        },
        include: {
          booking: true,
        },
        orderBy: [{ rowNumber: "asc" }, { seatNumber: "asc" }],
      });

      res.status(200).json({
        message: "Seats booked successfully",
        booking,
        bookedSeats,
      });
    } catch (serviceError: any) {
      res.status(400).json({
        error: serviceError.message,
      });
      return;
    }
  } catch (error: any) {
    // Handle unexpected errors
    console.error("Error in booking seat:", error);
    res.status(500).json({
      error: "Internal server error occurred while booking seats",
    });
  }
};

export const resetSeats = async (req: Request, res: Response) => {
  try {
    await prisma.seat.updateMany({
      where: { booked: true },
      data: { booked: false, bookingId: null },
    });
    await prisma.booking.deleteMany();
    res.status(200).json({ message: "Seats reset successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error in resetting seats : " + error.message });
  }
};

export const getBookings = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const bookings = await prisma.user.findMany({
      where: {
        id: userId,
      },
      include: {
        bookings: {
          include: {
            seats: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    res.status(200).json({ bookings });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error in getting bookings : " + error.message });
  }
};

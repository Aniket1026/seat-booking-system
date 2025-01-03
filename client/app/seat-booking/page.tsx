"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { fetchSeats, resetAllSeats } from "@/lib/redux/seatSlice";
import { bookingHistory, bookSeats } from "@/lib/redux/bookingSlice";
import { Logout } from "@/components/logout/Logout";

export default function TrainBookingSystem() {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const { seats, error, status } = useSelector((state: any) => state.seats);

  const { booking } = useSelector((state: any) => state.booking);

  const [numOfSeats, setNumOfSeats] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [updateSeats, setUpdateSeats] = useState(false);

  const handleBooking = async () => {
    if (numOfSeats > 7 || numOfSeats < 1) {
      setShowWarning(true);
      return;
    }
    const response: any = await dispatch(bookSeats(numOfSeats));
    if (response.error) {
      toast({
        title: "Booking",
        description: "Not enough seats available",
      });
      return;
    }

    setUpdateSeats(!updateSeats);
    toast({
      title: "Booking",
      description: "Seats booked successfully",
    });
  };

  const resetSeats = async () => {
    await dispatch(resetAllSeats());
    setUpdateSeats(!updateSeats);
    toast({
      description: "Seats reset successfully",
    });
  };

  const viewBooking = async () => {
    await dispatch(bookingHistory());
  };

  useEffect(() => {
    dispatch(fetchSeats());
  }, [dispatch, updateSeats]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold mb-6">Train Booking System</h1>
        <Logout />
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="grid grid-cols-7 gap-2">
              {error && (
                <div className="col-span-7 text-red-500">Cannot book seats</div>
              )}
              {status !== "success" ? (
                <div className="col-span-7 text-center py-4">Loading...</div>
              ) : (
                <>
                  {seats &&
                    seats?.seats?.map((seat: any) => (
                      <div
                        key={seat.id}
                        className={`aspect-square flex items-center justify-center rounded-md text-white text-sm font-bold ${
                          seat.booked ? "bg-red-500" : "bg-green-500"
                        } ${
                          seat.id > 77 ? "col-span-1" : ""
                        } hover:opacity-90 transition-opacity`}
                      >
                        {seat?.id}
                      </div>
                    ))}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/4 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Book Seats</h2>
            <span className="flex space-x-4 items-center">
              <span className="flex items-center space-x-1">
                <span>Booked</span>
                <span className="w-4 h-4 bg-green-500 rounded-full inline-block"></span>
              </span>
              <span className="flex items-center space-x-1">
                <span>Not Booked</span>
                <span className="w-4 h-4 bg-red-500 rounded-full inline-block"></span>
              </span>
            </span>
            <div>
              {booking?.bookedSeats && booking.bookedSeats.length > 0 ? (
                <span className="mt-2 flex flex-wrap gap-2">
                  {booking.bookedSeats.map((bookedSeat: any) => (
                    <span
                      key={bookedSeat.id}
                      className="inline-block bg-gray-100 rounded-md px-3 py-1 text-sm"
                    >
                      Seat {bookedSeat.id}
                    </span>
                  ))}
                </span>
              ) : (
                <></>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="seatCount" className="text-sm text-gray-600">
                  Number of Seats
                </label>
                <div className="flex gap-2">
                  <Input
                    id="seatCount"
                    type="number"
                    min="1"
                    max="7"
                    value={numOfSeats}
                    onChange={(e) => {
                      setNumOfSeats(Number(e.target.value));
                      setShowWarning(false);
                    }}
                    className="w-24"
                  />
                  <Button onClick={handleBooking} className="flex-1">
                    Book Now
                  </Button>
                </div>
              </div>

              {showWarning && (
                <Alert variant="destructive">
                  <AlertDescription>
                    You can book only between 1 to 7 seats at once.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
            <h2 className="text-lg font-semibold mb-2">Manage Bookings</h2>
            <Button onClick={resetSeats} className="w-full">
              Reset All Seats
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={viewBooking}
                >
                  View All Bookings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Current Bookings</DialogTitle>
                  <DialogDescription>
                    {booking?.bookings && booking.bookings.length > 0 ? (
                      <span className="mt-2 flex flex-wrap gap-2">
                        {booking.bookings.flatMap((userBooking: any) =>
                          userBooking.bookings.flatMap((booking: any) =>
                            booking.seats.map((seat: any) => (
                              <span
                                key={seat.id}
                                className="inline-block bg-gray-100 rounded-md px-3 py-1 text-sm"
                              >
                                Seat {seat.id}
                              </span>
                            ))
                          )
                        )}
                      </span>
                    ) : (
                      <span className="text-gray-500 mt-2">
                        No seats are currently booked.
                      </span>
                    )}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

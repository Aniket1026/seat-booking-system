import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class SeatBookingService {
  private static async getSeatingLayout(): Promise<number[][]> {
    const seats = await prisma.seat.findMany({
      orderBy: [{ rowNumber: "asc" }, { seatNumber: "asc" }],
    });

    // Convert to 2D array layout where 0 = empty, 1 = booked
    const layout: number[][] = [];
    let currentRow: number[] = [];
    let currentRowNumber = 1;

    seats.forEach((seat) => {
      if (seat.rowNumber !== currentRowNumber) {
        layout.push(currentRow);
        currentRow = [];
        currentRowNumber = seat.rowNumber;
      }
      currentRow.push(seat.booked ? 1 : 0);
    });
    if (currentRow.length > 0) {
      layout.push(currentRow);
    }

    return layout;
  }

  static async findAvailableSeats(count: number) {
    if (count > 7) {
      throw new Error("Cannot book more than 7 seats at once");
    }

    const seatingLayout = await this.getSeatingLayout();
    const seatingManager = new SeatingManager(seatingLayout);
    const [seats, message] = seatingManager.bookSeats(count);

    if (!seats) {
      throw new Error(message);
    }

    // Converting layout coordinates back to seat IDs
    return this.convertLayoutToSeatIds(seats);
  }

  private static async convertLayoutToSeatIds(
    layoutSeats: [number, number][]
  ): Promise<number[]> {
    const seatIds: number[] = [];

    for (const [rowIdx, colIdx] of layoutSeats) {
      const seat = await prisma.seat.findFirst({
        where: {
          rowNumber: rowIdx + 1,
          seatNumber: colIdx + 1,
          booked: false,
        },
      });

      if (seat) {
        seatIds.push(seat.id);
      }
    }

    return seatIds;
  }

  static async bookSeats(seatIds: number[], userId: number) {
    return prisma.$transaction(async (tx) => {
      const seats = await tx.seat.findMany({
        where: {
          id: { in: seatIds },
          booked: false,
        },
      });

      if (seats.length !== seatIds.length) {
        throw new Error("Some seats are no longer available");
      }

      const booking = await tx.booking.create({
        data: {
          userId,
          seats: {
            connect: seatIds.map((id) => ({ id })),
          },
        },
      });

      await tx.seat.updateMany({
        where: { id: { in: seatIds } },
        data: { booked: true, bookingId: booking.id },
      });

      return booking;
    });
  }
}

class SeatingManager {
  private seating: number[][];
  private rows: number;
  private availableSeats: number;

  constructor(seatingLayout: number[][]) {
    this.seating = seatingLayout;
    this.rows = seatingLayout.length;
    this.availableSeats = seatingLayout.reduce(
      (sum, row) => sum + row.filter((seat) => seat === 0).length,
      0
    );
  }

  private findSeatsInSingleRow(
    numSeats: number
  ): [number | null, number | null] {
    for (let rowIdx = 0; rowIdx < this.seating.length; rowIdx++) {
      const row = this.seating[rowIdx];
      const seatsInRow = row.length;

      for (let start = 0; start <= seatsInRow - numSeats; start++) {
        if ([...Array(numSeats)].every((_, i) => row[start + i] === 0)) {
          return [rowIdx, start];
        }
      }
    }
    return [null, null];
  }

  private calculateDistance(
    seat1: [number, number],
    seat2: [number, number]
  ): number {
    return Math.abs(seat1[0] - seat2[0]) + Math.abs(seat1[1] - seat2[1]);
  }

  private findNearestCluster(
    emptySeats: [number, number][],
    numSeats: number
  ): [number, number][] | null {
    if (emptySeats.length < numSeats) return null;

    emptySeats.sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));

    let minTotalDistance = Infinity;
    let bestCluster: [number, number][] | null = null;

    for (let i = 0; i <= emptySeats.length - numSeats; i++) {
      const currentCluster = emptySeats.slice(i, i + numSeats);

      let maxDistance = 0;
      let validCluster = true;

      for (const [rowIdx, colIdx] of currentCluster) {
        if (this.seating[rowIdx][colIdx] === 1) {
          validCluster = false;
          break;
        }
      }

      if (!validCluster) continue;

      for (let j = 0; j < currentCluster.length; j++) {
        for (let k = j + 1; k < currentCluster.length; k++) {
          const distance = this.calculateDistance(
            currentCluster[j],
            currentCluster[k]
          );
          maxDistance = Math.max(maxDistance, distance);
        }
      }

      if (maxDistance < minTotalDistance) {
        minTotalDistance = maxDistance;
        bestCluster = currentCluster;
      }
    }

    return bestCluster;
  }

  private findNearbySeats(numSeats: number): [number, number][] | null {
    const emptySeats: [number, number][] = [];

    for (let rowIdx = 0; rowIdx < this.seating.length; rowIdx++) {
      for (let seatIdx = 0; seatIdx < this.seating[rowIdx].length; seatIdx++) {
        if (this.seating[rowIdx][seatIdx] === 0) {
          emptySeats.push([rowIdx, seatIdx]);
        }
      }
    }

    return this.findNearestCluster(emptySeats, numSeats);
  }

  bookSeats(numSeats: number): [[number, number][] | null, string] {
    if (numSeats > 7) {
      return [null, "Cannot book more than 7 seats at a time"];
    }

    if (numSeats > this.availableSeats) {
      return [null, "Not enough seats available"];
    }

    const [rowIdx, start] = this.findSeatsInSingleRow(numSeats);

    if (rowIdx !== null && start !== null) {
      const seatsBooked: [number, number][] = [];
      for (let i = 0; i < numSeats; i++) {
        this.seating[rowIdx][start + i] = 1;
        seatsBooked.push([rowIdx, start + i]);
      }
      this.availableSeats -= numSeats;
      return [seatsBooked, "Booked in single row"];
    }

    const nearbySeats = this.findNearbySeats(numSeats);
    if (nearbySeats) {
      for (const [rowIdx, seatIdx] of nearbySeats) {
        if (this.seating[rowIdx][seatIdx] === 1) {
          return [null, "Selected seats no longer available"];
        }
      }

      for (const [rowIdx, seatIdx] of nearbySeats) {
        this.seating[rowIdx][seatIdx] = 1;
      }
      this.availableSeats -= numSeats;
      return [nearbySeats, "Booked in nearby seats"];
    }

    return [null, "No suitable seats available"];
  }
}
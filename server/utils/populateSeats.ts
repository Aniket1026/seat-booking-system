import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function populateSeats() {
  const seats: { rowNumber: number; seatNumber: number }[] = [];
  for (let row = 1; row <= 11; row++) {
    for (let position = 1; position <= 7; position++) {
      seats.push({
        rowNumber: row,
        seatNumber: position,
      });
    }
  }
  for (let position = 1; position <= 3; position++) {
    seats.push({ rowNumber: 12, seatNumber: position });
  }
  await prisma.seat.createMany({ data: seats });
}

populateSeats().catch(console.error);

# Project Name

This repository contains a full-stack seat booking application with a Next.js frontend, Express.js backend, Prisma ORM, and Supabase integration.

## Features

- User Authentication (Signup, Login, Logout)
- Seat Booking Management
- View Booking History
- Reset All Seats

## Tech Stack

- **Frontend**: Next.js,Tailwind,shadcn
- **Backend**: Express.js
- **Database**: Prisma ORM with Supabase

---

## Setup Instructions

### Prerequisites

1. Node.js (v20)
2. npm or yarn
3. Supabase account with a configured project

### Installation

1. Clone the repository:

```bash
$ git clone https://github.com/Aniket1026/seat-booking-system.git
$ cd your-repo-name
```

2. Install dependencies for both frontend and backend:

```bash
# For backend
$ cd server
$ npm install

# For frontend
$ cd ../client
$ npm install
```

3. Configure Environment Variables by looking at .env.example

4. Migrate the database with Prisma:

```bash
$ cd server
$ npx prisma migrate deploy
```

5. Start the backend server:

```bash
$ npm run dev
```

6. Start the frontend application:

```bash
$ cd ../frontend
$ npm run dev
```

### Deployment

- **Backend**: Deployed on Railway
- **Frontend**: Deployed on Vercel

---

## API Documentation

### Authentication APIs

#### **Login**

**Endpoint:** `POST /api/login`

- **Description:** Logs in the user.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```
- **Response:**
  ```json
  {
    "message": "",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com"
    }
  }
  ```

#### **Signup**

**Endpoint:** `POST /api/signup`

- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "user@example.com",
    "password": "your_password"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User created successfully",
    "user": {
      "id": 10,
      "name": "John Doe",
      "email": "user@example.com",
      "createdAt": "2025-01-05T03:56:04.088Z"
    }
  }
  ```

#### **Logout**

**Endpoint:** `POST /api/logout`

- **Description:** Logs out the user.
- **Response:**
  ```json
  {
    "message": "Logout successful"
  }
  ```

### Booking APIs

#### **Get All Seats**

**Endpoint:** `GET /api/booking/seats`

- **Description:** Retrieves all seat availability.
- **Response:**
  ```json
  {
    "seats": [
      {
        "id": 1,
        "seatNumber": 1,
        "rowNumber": 1,
        "booked": true,
        "bookingId": 1
      },
      {
        "id": 2,
        "seatNumber": 2,
        "rowNumber": 1,
        "booked": true,
        "bookingId": 1
      }
    ]
  }
  ```

#### **Reset All Seats**

**Endpoint:** `POST /api/booking/reset`

- **Description:** Resets all seat bookings.
- **Response:**
  ```json
  {
    "message": "All seats reset successfully"
  }
  ```

#### **Book Seat**

**Endpoint:** `POST /api/booking/book-seat`

- **Description:** Books a seat for the current user.
- **Request Body:**
  ```json
  {
    "numOfSeats": 3
  }
  ```
- **Response:**
  ```json
  {
    "message": "Seats booked successfully",
    "booking": {
      "id": 168,
      "userId": 10,
      "createdAt": "2025-01-05T17:46:00.928Z"
    },
    "bookedSeats": [
      {
        "id": 1,
        "seatNumber": 1,
        "rowNumber": 1,
        "booked": true,
        "bookingId": 168,
        "booking": {
          "id": 168,
          "userId": 10,
          "createdAt": "2025-01-05T17:46:00.928Z"
        }
      },
      {
        "id": 2,
        "seatNumber": 2,
        "rowNumber": 1,
        "booked": true,
        "bookingId": 168,
        "booking": {
          "id": 168,
          "userId": 10,
          "createdAt": "2025-01-05T17:46:00.928Z"
        }
      },
      {
        "id": 3,
        "seatNumber": 3,
        "rowNumber": 1,
        "booked": true,
        "bookingId": 168,
        "booking": {
          "id": 168,
          "userId": 10,
          "createdAt": "2025-01-05T17:46:00.928Z"
        }
      }
    ]
  }
  ```

#### **Booking History**

**Endpoint:** `GET /api/booking/booking-history`

- **Description:** Fetches booking history for the logged-in user.
- **Response:**
  ```json
  {
    "bookings": [
      {
        "id": 10,
        "name": "Aniket",
        "email": "aniket@gmail.com",
        "createdAt": "2025-01-05T03:56:04.088Z",
        "bookings": [
          {
            "id": 168,
            "userId": 10,
            "createdAt": "2025-01-05T17:46:00.928Z",
            "seats": [
              {
                "id": 1,
                "seatNumber": 1,
                "rowNumber": 1,
                "booked": true,
                "bookingId": 168
              },
              {
                "id": 2,
                "seatNumber": 2,
                "rowNumber": 1,
                "booked": true,
                "bookingId": 168
              },
              {
                "id": 3,
                "seatNumber": 3,
                "rowNumber": 1,
                "booked": true,
                "bookingId": 168
              }
            ]
          }
        ]
      }
    ]
  }
  ```

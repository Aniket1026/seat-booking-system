import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import { auth } from "./routes/auth";
import { bookingRouter } from "./routes/booking";

const corsOptions = {
  origin: process.env.FRONTEND_URL!,
  credentials: true,
};


const app = express();
app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", auth);
app.use("/api/booking", bookingRouter)

export default app;
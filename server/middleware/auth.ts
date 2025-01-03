import { Response } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../interface/customRequest";



export const authMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: () => void
): Promise<void> => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded.payload;
    next();
  } catch (error: any) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

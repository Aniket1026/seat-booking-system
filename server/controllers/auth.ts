import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { createToken } from "../utils/token";
import { cookieOptions } from "../utils/cookieOption";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const signupHanlder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Please provide all required fields" });
      return;
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = await createToken({ id: user.id });

    res.cookie("token", token, cookieOptions);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error in user signup : " + error.message });
  }
};

export const loginHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({
        error: "User does not exist",
      });
      return;
    }

    const passwordMatch = await bcryptjs.compare(password, user?.password);
    if (!passwordMatch) {
      res.status(400).json({
        error: "Incorrect password",
      });
      return
    }

    const token = await createToken({ id: user?.id });

    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const logoutHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error: any) {
    res.status(500).json({ error: "Error in user logout " + error.message });
  }
};

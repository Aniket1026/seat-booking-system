import jwt from "jsonwebtoken";

export const createToken = async (payload: object) => {
  try {
    return await jwt.sign({ payload }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
  } catch (error: any) {
    throw new Error("Error in creating token: " + error.message);
  }
};

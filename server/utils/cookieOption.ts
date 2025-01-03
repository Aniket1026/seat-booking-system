export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 1000 * 60 * 60,
  expires: new Date(Date.now() + 1000 * 60 * 60),
  path: "/"
};
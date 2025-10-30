import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const SECRET =
    process.env.JWT_SECRET || "super_duper_secret_key";
  const token = jwt.sign({ sub: userId }, SECRET, {
    expiresIn: "15d"
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development"
  });

  return token;
};

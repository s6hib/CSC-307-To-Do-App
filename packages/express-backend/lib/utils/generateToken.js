import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (user, res) => {
  const SECRET = process.env.JWT_SECRET;
  console.log("What is the username? : ", user.username);
  const token = jwt.sign(
    { id: user._id, username: user.username },
    SECRET,
    {
      expiresIn: "15d"
    }
  );

  res.cookie("token", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true, //process.env.NODE_ENV === "production",
    path: "/"
  });

  return token;
};

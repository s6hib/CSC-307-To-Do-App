import jwt from "jsonwebtoken";

// to authenticate user using jwt
export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).end();
  } else {
    jwt.verify(
      token,
      process.env.TOKEN_SECRET,
      (error, decoded) => {
        if (error) {
          return res.status(401).end();
        }
        req.user = decoded;
        next();
      }
    );
  }
};

import jwt from "jsonwebtoken";

export function authenticateUser(req, res, next) {
  //finds user's token
  const bearer =
    req.headers.authorization?.match(/^Bearer\s+(.+)$/i);
  const token = req.cookies?.token || bearer?.[1];

  //if user doesn't have tokens
  if (!token) {
    return res.status(401).end();
  }
  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (error, payload) => {
      if (error) {
        console.log("error: ", error.message);
        return res.status(401).end();
      }
      req.user = {
        _id: payload.id,
        username: payload.username
      };
      next();
    }
  );
}

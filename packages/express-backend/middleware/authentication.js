import jwt from "jsonwebtoken";

export function authenticateUser(req, res, next) {
  // const bearer =
  //   req.headers.authorization?.match(/^Bearer\s+(.+)$/i);

  // const token = req.cookies?.token || bearer?.[1];

  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).end();
  }
  jwt.verify(
    token,
    process.env.TOKEN_SECRET || "super_duper_secret_key",
    (error, payload) => {
      if (error) {
        return res.status(401).end();
      }
      const _id = payload.sub || payload._id || payload.id;
      if (!_id) return res.status(401).end();

      req.user = {
        _id
      };
      next();
    }
  );
}

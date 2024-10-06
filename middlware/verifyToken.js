import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "You are unauthenticated!" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Token is not valid!" });
    }
    req.adminId = payload.id;

    next();
  });
};

export default verifyToken;
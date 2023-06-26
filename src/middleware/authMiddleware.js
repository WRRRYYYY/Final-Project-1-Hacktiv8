const { verifyToken } = require("../helpers/jwt");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication failed! No token provided!" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Authentication failed! Invalid token!" });
  }
};

module.exports = authMiddleware;

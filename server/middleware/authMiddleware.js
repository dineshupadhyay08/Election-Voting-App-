const jwt = require("jsonwebtoken");
const HttpError = require("./HttpError");

const authMiddleware = (req, res, next) => {
  try {
    let token;

    // 1️⃣ Cookie se
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 2️⃣ Header se (fallback)
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.log("No token provided. Cookies:", req.cookies);
      return next(
        new HttpError("Authentication required. No token provided.", 401),
      );
    }

    const secret =
      process.env.JWT_SECRET || "default_secret_key_change_in_production";
    const decoded = jwt.verify(token, secret);
    console.log("JWT DECODED:", decoded);
    req.user = decoded;

    next();
  } catch (err) {
    console.log("Auth error:", err.message);
    return next(new HttpError("Authentication failed.", 401));
  }
};

module.exports = authMiddleware;

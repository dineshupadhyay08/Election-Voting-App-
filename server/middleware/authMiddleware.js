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
      return next(
        new HttpError("Authentication required. No token provided.", 401)
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SRCRET);
    // console.log("JWT DECODED:", decoded);
    req.user = decoded;

    next();
    // console.log("Cookies received:", req.cookies);
    // console.log("AUTH USER:", req.user);
    // console.log("COOKIES:", req.cookies);
  } catch (err) {
    return next(new HttpError("Authentication failed.", 401));
  }
};

module.exports = authMiddleware;

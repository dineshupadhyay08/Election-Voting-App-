const HttpError = require("./HttpError");

const adminMiddleware = (req, res, next) => {
  try {
    // 🔒 authMiddleware ke baad hi chalega
    // req.user = { id, isAdmin }

    if (!req.user) {
      return next(new HttpError("Not authenticated", 401));
    }

    if (!req.user.isAdmin) {
      return next(new HttpError("Admin access only", 403));
    }

    // ✅ Admin verified
    next();
  } catch (error) {
    return next(new HttpError("Admin authorization failed", 500));
  }
};

module.exports = adminMiddleware;

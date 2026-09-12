const HttpError = require("./HttpError");

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return next(new HttpError("Admin access required.", 403));
  }
};

module.exports = adminMiddleware;

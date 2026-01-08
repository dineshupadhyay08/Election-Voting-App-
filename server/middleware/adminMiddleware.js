const HttpError = require("./HttpError");
const VoterModel = require("../model/voterModel");

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(new HttpError("Not authenticated", 401));
    }

    const voter = await VoterModel.findById(req.user.id);

    if (!voter || voter.isAdmin !== true) {
      return next(new HttpError("Admin access only", 403));
    }

    // ✅ trusted admin
    next();
  } catch (err) {
    return next(new HttpError("Admin authorization failed", 500));
  }
};

module.exports = adminMiddleware;

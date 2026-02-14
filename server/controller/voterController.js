const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const VoterModel = require("../model/voterModel.js");
const HttpError = require("../middleware/HttpError.js");

// Token generation functions
const generateAccessToken = (payload) => {
  const secret =
    process.env.JWT_SECRET || "default_secret_key_change_in_production";
  return jwt.sign(payload, secret, { expiresIn: "15m" });
};

const generateRefreshToken = (payload) => {
  const secret =
    process.env.JWT_REFRESH_SECRET ||
    "default_refresh_secret_change_in_production";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

// Validate password strength
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength)
    return "Password must be at least 8 characters long";
  if (!hasUpperCase)
    return "Password must contain at least one uppercase letter";
  if (!hasLowerCase)
    return "Password must contain at least one lowercase letter";
  if (!hasNumber) return "Password must contain at least one number";
  if (!hasSpecialChar)
    return "Password must contain at least one special character";
  return null;
};

//*******REGISTER NEW VOTER********* */

const registerVoterController = async (req, res, next) => {
  try {
    const { fullName, email, password, password2, mobileNumber } = req.body;

    if (!fullName || !email || !password || !password2 || !mobileNumber) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    const newEmail = email.toLowerCase().trim();
    const emailExists = await VoterModel.findOne({ email: newEmail });
    if (emailExists) {
      return next(new HttpError("Email already exists.", 422));
    }

    const trimmedPassword = password.trim();
    const passwordError = validatePassword(trimmedPassword);
    if (passwordError) {
      return next(new HttpError(passwordError, 422));
    }

    if (trimmedPassword !== password2.trim()) {
      return next(new HttpError("Passwords do not match.", 422));
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(trimmedPassword, salt);

    const isAdmin = false;

    await VoterModel.create({
      fullName,
      email: newEmail,
      password: hashedPassword,
      mobile_number: mobileNumber,
      isAdmin,
    });

    res
      .status(201)
      .json({ success: true, message: `New Voter ${fullName} created.` });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Voter register failed.", 422));
  }
};

//******* LOGIN VOTER *********//
const loginVoterController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new HttpError("Please provide email and password.", 422));
    }

    const voter = await VoterModel.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!voter) {
      return next(new HttpError("Invalid credentials.", 401));
    }

    const isMatch = await bcrypt.compare(password.trim(), voter.password);
    if (!isMatch) {
      return next(new HttpError("Invalid credentials.", 401));
    }

    const { _id: id, isAdmin, votedElections } = voter;
    const accessToken = generateAccessToken({ id, isAdmin });
    const refreshToken = generateRefreshToken({ id, isAdmin });

    const isProduction = process.env.NODE_ENV === "production";

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        id,
        isAdmin,
        votedElections,
        accessToken,
      });
  } catch (err) {
    console.log("Login error:", err);
    return next(new HttpError("Login failed. Try again later.", 500));
  }
};

//******* REFRESH TOKEN *********//
const refreshTokenController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return next(new HttpError("Refresh token required.", 401));
    }

    const secret =
      process.env.JWT_REFRESH_SECRET ||
      "default_refresh_secret_change_in_production";
    const decoded = jwt.verify(refreshToken, secret);

    const voter = await VoterModel.findById(decoded.id);
    if (!voter) {
      return next(new HttpError("User not found.", 404));
    }

    const accessToken = generateAccessToken({
      id: voter._id,
      isAdmin: voter.isAdmin,
    });

    res.json({ success: true, accessToken });
  } catch (err) {
    return next(new HttpError("Invalid refresh token.", 401));
  }
};

//******* LOGOUT *********//
const logoutController = async (req, res, next) => {
  try {
    res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    return next(new HttpError("Logout failed.", 500));
  }
};

//******* GET VOTER PROFILE *********//

const getVoterController = async (req, res, next) => {
  try {
    console.log("REQ.USER:", req.user);

    if (!req.user || !req.user.id) {
      return next(new HttpError("User not authenticated", 401));
    }

    const voter = await VoterModel.findById(req.user.id).select("-password");

    if (!voter) {
      return next(new HttpError("Voter not found", 404));
    }

    res.status(200).json(voter);
  } catch (error) {
    console.log("GET VOTER ERROR:", error);
    return next(new HttpError("Couldn't get voter profile", 500));
  }
};

const getMyProfileController = async (req, res, next) => {
  try {
    const voter = await VoterModel.findById(req.user.id).select("-password");

    if (!voter) {
      return next(new HttpError("Voter not found", 404));
    }

    res.json(voter);
  } catch (error) {
    return next(new HttpError("Profile fetch failed", 500));
  }
};

//******* UPDATE VOTER PROFILE *********//
const updateVoterController = async (req, res, next) => {
  try {
    const { fullName, email, mobile_number } = req.body;

    if (!req.user || !req.user.id) {
      return next(new HttpError("User not authenticated", 401));
    }

    // Check if email is already taken by another user
    if (email) {
      const existingVoter = await VoterModel.findOne({
        email: email.toLowerCase(),
        _id: { $ne: req.user.id },
      });
      if (existingVoter) {
        return next(new HttpError("Email already exists.", 422));
      }
    }

    const updatedVoter = await VoterModel.findByIdAndUpdate(
      req.user.id,
      {
        ...(fullName && { fullName }),
        ...(email && { email: email.toLowerCase() }),
        ...(mobile_number && { mobile_number }),
      },
      { new: true },
    ).select("-password");

    if (!updatedVoter) {
      return next(new HttpError("Voter not found", 404));
    }

    res.status(200).json(updatedVoter);
  } catch (error) {
    console.log("UPDATE VOTER ERROR:", error);
    return next(new HttpError("Profile update failed", 500));
  }
};

// ✅ Export all controllers
module.exports = {
  registerVoterController,
  loginVoterController,
  refreshTokenController,
  logoutController,
  getVoterController,
  getMyProfileController,
  updateVoterController,
};

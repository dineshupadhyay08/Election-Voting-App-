const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const VoterModel = require("../model/voterModel.js");
const HttpError = require("../middleware/HttpError.js");

//*******REGISTER NEW VOTER********* */

const registerVoterController = async (req, res, next) => {
  try {
    const { fullName, email, password, password2, mobileNumber } = req.body;

    if (!fullName || !email || !password || !password2 || !mobileNumber) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    const newEmail = email.toLowerCase();
    const emailExists = await VoterModel.findOne({ email: newEmail });
    if (emailExists) {
      return next(new HttpError("Email already exists.", 422));
    }

    if (password.trim().length < 6) {
      return next(
        new HttpError("Password must be at least 6 characters.", 422)
      );
    }

    if (password !== password2) {
      return next(new HttpError("Passwords do not match.", 422));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let isAdmin = false;
    if (newEmail === "admin@gmail.com") {
      isAdmin = true;
    }

    await VoterModel.create({
      fullName,
      email: newEmail,
      password: hashedPassword,
      mobile_number: mobileNumber,
      isAdmin,
    });

    res.status(201).json(`New Voter ${fullName} created.`);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Voter register failed.", 422));
  }
};

const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SRCRET, { expiresIn: "1d" });
  return token;
};

//******* LOGIN VOTER *********//
const loginVoterController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new HttpError("Please provide email and password.", 422));
    }

    const voter = await VoterModel.findOne({
      email: email.toLowerCase(),
    }).select("+password"); // ⭐ MOST IMPORTANT LINE

    if (!voter) {
      return next(new HttpError("Invalid credentials.", 401));
    }

    const isMatch = await bcrypt.compare(password, voter.password);
    if (!isMatch) {
      return next(new HttpError("Invalid credentials.", 401));
    }

    const { _id: id, isAdmin, votedElections } = voter;
    const token = generateToken({ id, isAdmin });

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        id,
        isAdmin,
        votedElections,
      });
    console.log("LOGIN BODY:", req.body);
    console.log(voter);
  } catch (err) {
    console.log("Login error:", err);
    return next(new HttpError("Login failed. Try again later.", 500));
  }
};

module.exports = { loginVoterController };

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

// ✅ Export all controllers
module.exports = {
  registerVoterController,
  loginVoterController,
  getVoterController,
  getMyProfileController,
};

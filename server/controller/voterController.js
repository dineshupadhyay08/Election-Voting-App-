const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const VoterModel = require("../model/voterModel.js") 
const HttpError = require("../middleware/HttpError.js") 


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
      return next(new HttpError("Password must be at least 6 characters.", 422));
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
      mobile_number : mobileNumber,
      isAdmin
    });

    res.status(201).json(`New Voter ${fullName} created.`);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Voter register failed.", 422));
  }
};



const generateToken = (payload) =>{
    const token = jwt.sign(payload,process.env.JWT_SRCRET,{expiresIn: "1d"})
    return token;
}

//******* LOGIN VOTER *********//
const loginVoterController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password provided
    if (!email || !password) {
      return next(new HttpError("Please provide email and password.", 422));
    }

    const voter = await VoterModel.findOne({ email: email.toLowerCase() });
    if (!voter) {
      return next(new HttpError("Invalid credentials.", 401));
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, voter.password);
    if (!isMatch) {
      return next(new HttpError("Invalid credentials.", 401));
    }

    const {_id : id, isAdmin, votedElections} = voter;
    const token = generateToken({id, isAdmin})

    res.json({token, id, votedElections, isAdmin})
    

  } catch (err) {
    console.log("Login error:", err);
    return next(new HttpError("Login failed. Try again later.", 500));
  }
};

module.exports = { loginVoterController };


const getVoterController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const voter = await VoterModel.findById(id).select("-password")
        res.json(voter)
        // console.log("Voter",voter)
    } catch (error) {
        return next(HttpError("Couldn't get voter",404))
        
    }
}

// ✅ Export all controllers
module.exports = {
    registerVoterController,
    loginVoterController,
    getVoterController,
};

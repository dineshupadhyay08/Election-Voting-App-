const { Schema, model, Types } = require("mongoose");

const candidateSchema = new Schema(
  {
    /* ================= BASIC INFO ================= */
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      required: true,
    },

    dateOfBirth: {
      type: Date,
    },

    age: {
      type: Number,
    },

    /* ================= FAMILY INFO ================= */
    fatherName: {
      type: String,
      default: "",
    },

    motherName: {
      type: String,
      default: "",
    },

    spouseName: {
      type: String,
      default: "",
    },

    /* ================= CONTACT INFO ================= */
    mobileNumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      default: "",
    },

    address: {
      village: String,
      district: String,
      state: String,
    },

    /* ================= POLITICAL INFO ================= */
    party: {
      type: String,
      required: true, // BJP / INC / AAP / IND
    },

    symbol: {
      type: String, // party symbol image
      default: "",
    },

    image: {
      type: String, // candidate photo
      required: true,
    },

    motto: {
      type: String,
      default: "", // vision / slogan
    },

    goodWorks: {
      type: [String], // development works
      default: [],
    },

    badWorks: {
      type: [String], // controversies
      default: [],
    },

    experience: {
      type: String, // political experience
      default: "",
    },

    /* ================= ELECTION INFO ================= */
    voteCount: {
      type: Number,
      default: 0,
    },

    election: {
      type: Types.ObjectId,
      ref: "Election",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = model("Candidate", candidateSchema);

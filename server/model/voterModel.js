const { Schema, model, Types } = require("mongoose");

const voterSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
    },

    dateOfBirth: {
      type: Date,
    },

    mobile_number: {
      type: Number,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    address: {
      village: String,
      gramPanchayat: String,
      district: String,
      state: String,
      pincode: String,
    },

    votedElections: [
      {
        type: Types.ObjectId,
        ref: "Election",
      },
    ],

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model("voter", voterSchema);

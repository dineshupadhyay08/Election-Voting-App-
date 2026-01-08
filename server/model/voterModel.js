const { Schema, model, Types } = require("mongoose");

const voterSchema = new Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    mobile_number: {
      type: Number,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    votedElections: [
      {
        type: Types.ObjectId,
        ref: "Election",
        required: true,
      },
    ],
    isAdmin: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = model("voter", voterSchema);

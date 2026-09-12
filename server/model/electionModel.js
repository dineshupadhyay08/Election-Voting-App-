const { Schema, model, Types } = require("mongoose");

const electionSchema = new Schema(
  {
    /* ================= BASIC INFO ================= */
    title: {
      type: String,
      required: true, // "Sarpanch Chunav"
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    thumbnail: {
      type: String, // image URL for card
      default: "",
    },

    /* ================= CATEGORY (FILTER) ================= */
    category: {
      type: String,
      enum: ["PANCHAYAT", "WARD", "ASSEMBLY", "LOK_SABHA"],
      required: true,
    },

    /* ================= DATE & STATUS ================= */
    startDate: {
      type: Date, // election starts
      required: true,
    },

    endDate: {
      type: Date, // election ends
      required: true,
    },

    status: {
      type: String,
      enum: ["UPCOMING", "LIVE", "COMPLETED"],
      default: "UPCOMING",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    /* ================= RELATIONS ================= */
    candidates: [
      {
        type: Types.ObjectId,
        ref: "Candidate",
      },
    ],

    voters: [
      {
        type: Types.ObjectId,
        ref: "Voter",
      },
    ],
  },
  { timestamps: true }
);

/* ================= AUTO STATUS HANDLER ================= */
// Status is now calculated dynamically in the business logic layer using electionLifecycle.js.

module.exports = model("Election", electionSchema);

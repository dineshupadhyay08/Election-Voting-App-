const { Schema, model, Types } = require("mongoose");

const voteSchema = new Schema(
  {
    voter: {
      type: Types.ObjectId,
      ref: "Voter",
      required: true,
    },
    election: {
      type: Types.ObjectId,
      ref: "Election",
      required: true,
    },
    candidate: {
      type: Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    deviceFingerprint: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    votedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Compound index to prevent duplicate votes per voter per election
voteSchema.index({ voter: 1, election: 1 }, { unique: true });

module.exports = model("Vote", voteSchema);
